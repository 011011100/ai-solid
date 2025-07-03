import {type Component} from "solid-js";
import HistoryQuestionMenu from "../components/menu/history-question-menu.tsx";
import FunctionMenu from "../components/menu/function-menu.js";

const Sidebar: Component = () => {
    return (
        <>
            <FunctionMenu/>
            <HistoryQuestionMenu/>
        </>
    )
}

export default Sidebar
