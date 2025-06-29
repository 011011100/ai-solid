import {type Component, createSignal, For, type JSX, onCleanup} from "solid-js";

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
    let containerRef: HTMLDivElement | undefined;

    const handleDocumentClick = (e: MouseEvent) => {
        if (!containerRef?.contains(e.target as Node)) {
            setOpen(false);
        }
    };

    // 挂载全局点击监听器
    document.addEventListener("click", handleDocumentClick);
    onCleanup(() => document.removeEventListener("click", handleDocumentClick));

    return (
        <div class="relative grid place-items-center" ref={containerRef}>
            <button
                class="rounded "
                onClick={(e) => {
                    e.stopPropagation(); // 阻止冒泡以避免立即触发外部关闭
                    setOpen(!open());
                }}
            >
                <IconMdiBlur class='w-4 h-4 '/>
            </button>
            {open() && (
                <div class="absolute top-full left-0 mt-1 w-22 bg-white rounded shadow z-50"
                     onMouseLeave={() => setOpen(false)}
                >
                    <ul class="before:hidden p-0 m-0">
                        <For each={props.items}>
                            {(item) => (
                                <li class="px-2 py-2 hover:bg-gray-100 cursor-pointer flex items-center flex-nowarp flex-row"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        item.action(props.index)
                                    }}
                                >
                                    {item.node}
                                </li>
                            )}
                        </For>
                    </ul>
                </div>
            )}
        </div>
    );
}

export default DropdownMenu;
