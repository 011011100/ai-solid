import {
    type Component,
    createSignal,
    For,
    type JSX,
    onCleanup,
    onMount,
} from "solid-js";
import { Portal } from "solid-js/web";

export interface DropdownItem {
    node: JSX.Element;
    action: (index: number) => void;
}

interface DropdownMenuProps {
    items: DropdownItem[];
    index: number;
}

const DropdownMenu: Component<DropdownMenuProps> = (props) => {
    const [open, setOpen] = createSignal(false);
    const [position, setPosition] = createSignal({ top: 0, left: 0 });

    let buttonRef: HTMLButtonElement | undefined;

    const handleDocumentClick = (e: MouseEvent) => {
        if (
            !buttonRef?.contains(e.target as Node) &&
            !(document.getElementById(menuId())?.contains(e.target as Node))
        ) {
            setOpen(false);
        }
    };

    onMount(() => {
        document.addEventListener("click", handleDocumentClick);
    });

    onCleanup(() => {
        document.removeEventListener("click", handleDocumentClick);
    });

    const menuId = () => `dropdown-menu-${props.index}`;

    const toggleMenu = () => {
        if (!buttonRef) return;

        const rect = buttonRef.getBoundingClientRect();
        setPosition({
            top: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX,
        });
        setOpen(!open());
    };

    return (
        <>
            <button
                ref={buttonRef}
                class="rounded"
                onClick={(e) => {
                    e.stopPropagation();
                    toggleMenu();
                }}
            >
                <IconMdiBlur class="w-4 h-4" />
            </button>

            {open() && (
                <Portal>
                    <div
                        id={menuId()}
                        class="absolute bg-white rounded shadow z-50 w-28"
                        style={{
                            position: "absolute",
                            top: `${position().top}px`,
                            left: `${position().left}px`,
                        }}
                        onMouseLeave={() => setOpen(false)}
                    >
                        <ul class="p-0 m-0">
                            <For each={props.items}>
                                {(item) => (
                                    <li
                                        class="px-2 py-2 hover:bg-gray-100 cursor-pointer flex items-center whitespace-nowrap"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            item.action(props.index);
                                            setOpen(false);
                                        }}
                                    >
                                        {item.node}
                                    </li>
                                )}
                            </For>
                        </ul>
                    </div>
                </Portal>
            )}
        </>
    );
};

export default DropdownMenu;
