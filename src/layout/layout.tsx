import Header from "./header.js";
import Sidebar from "./sidebar.js";
import type { JSX } from "solid-js";

type LayoutProps = {
    children: JSX.Element;
};

function layout({ children }: LayoutProps) {
    return(
        <div>
            <Header/>
            <div class='flex items-center justify-center'>
                <Sidebar/>
                {children}
            </div>
            {/*<Footer/>*/}
        </div>
    )
}

export default layout
