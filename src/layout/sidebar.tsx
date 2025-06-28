import {type Component} from "solid-js";
import HistoryQuestionMenu from "../components/menu/history-question-menu.js";
import FunctionMenu from "../components/menu/function-menu.js";

const sidebar: Component = () => {
    return (
        <>
            <FunctionMenu/>
            <HistoryQuestionMenu/>
        </>
    )
}

export default sidebar
