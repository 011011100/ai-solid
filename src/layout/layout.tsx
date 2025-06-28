import Sidebar from "./sidebar.js";
import {type Component, type JSX} from "solid-js";
import ChooseModel from "../components/choose-model/choose-model.js";

type LayoutProps = {
    children: JSX.Element;
};

const layout: Component<LayoutProps> = (props: LayoutProps) => {
    return (
        <div class="flex w-full flex-col">
            {/*<div class="card rounded-box shadow-sm h-20 place-items-center">*/}
            {/*    <Header/>*/}
            {/*</div>*/}
            <div class="card rounded-box place-items-center">
                <div class="flex w-full">
                    <div class="card rounded-box max-w-min bg-base-200 shadow-sm grow place-items-center">
                        <Sidebar/>
                    </div>
                    {/*<div class="card w-full rounded-box shadow-sm grow place-items-center flex overflow-auto h-[calc(100vh-80px)]">*/}
                    <div class='card w-full'>
                        <div
                            // class='absolute top-0 w-full h-20 bg-transparent text-right p-3 flex items-start justify-between'>
                            class='absolute top-0 w-full h-20 bg-transparent text-right p-3 flex items-start justify-between'>
                            {/*<button>*/}
                            {/*    <IconMdiMenuOpen class='size-6'/>*/}
                            {/*</button>*/}
                            <ChooseModel/>
                        </div>
                        <div
                            class="card w-full rounded-box shadow-sm grow place-items-center flex overflow-auto h-[calc(100vh)]">
                            {props.children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default layout
