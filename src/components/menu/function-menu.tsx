import type {Component} from "solid-js";
import {useMessagesStore} from "../../stores/chat-message-store.js";
import {useChatQuestionStore} from "../../stores/chat-question-store.js";

const FunctionMenu: Component = () => {

    const {removeAllMessage} = useMessagesStore()

    const chatStore = useChatQuestionStore()

    function newQuestion() {
        removeAllMessage()
        const uuid = crypto.randomUUID().replace("-","");
        chatStore.setConversationId(uuid);
        chatStore.setIsNewQuestion(true);
    }

    return (
        <ul class="menu bg-base-200 rounded-box w-56">
            <li onClick={() => newQuestion()}>
                <a class='flex items-center'>
                    <IconLineMdFileDocumentPlus class="w-4 h-4"/>
                    <p class='text-base'>新问题</p>
                </a>
                {/*<a class='flex items-center'>*/}
                {/*    <IconLineMdCogFilledLoop class="w-4 h-4"/>*/}
                {/*    <p class='text-base'>记忆管理</p>*/}
                {/*</a>*/}
            </li>
        </ul>
    )
}

export default FunctionMenu
