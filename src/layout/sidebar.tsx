import {type Component} from "solid-js";
import HistoryQuestionMenu from "../components/menu/history-question-menu.js";
import NewQuestionMenu from "../components/menu/new-question-menu.js";

const sidebar: Component = () => {
    return (
        <>
            <NewQuestionMenu/>
            <HistoryQuestionMenu/>
        </>
    )
}

export default sidebar
