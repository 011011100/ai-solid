import Header from "./header.js";
import Sidebar from "./sidebar.js";
import type { JSX } from "solid-js";

type LayoutProps = {
    children: JSX.Element;
};

function layout({ children }: LayoutProps) {
    return(
        <div class="flex w-full flex-col">
            <div class="card rounded-box shadow-sm h-20 place-items-center">
                <Header/>
            </div>
            <div class="card rounded-box place-items-center">
                <div class="flex w-full">
                    <div class="card rounded-box max-w-min shadow-sm grow place-items-center">
                        <Sidebar/>
                    </div>
                    <div class="card w-full rounded-box shadow-sm grow place-items-center">
                        {children}
                    </div>
                </div>
            </div>
        </div>
)
}

export default layout
