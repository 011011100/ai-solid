import type {Component} from "solid-js";
import {useMessagesStore} from "../../stores/chat-message-store.js";
import {useChatQuestionStore} from "../../stores/chat-question-store.js";

const newQuestionMenu: Component = () => {

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
                    <IconMdiFileDocumentPlusOutline class="w-4 h-4"/>
                    <p class='text-base'>新问题</p>
                </a>
            </li>
        </ul>
    )
}

export default newQuestionMenu
