import QuestionBox from "../components/question-box/question-box.js";
import {useChatQuestionStore} from "../stores/chat-question-store.js";
import MarkdownIt from "markdown-it";

const Chat = () => {
    const {inside, answer} = useChatQuestionStore()

    const md = new MarkdownIt

    return (
        <div class='w-100% p-2'>
            {inside() ?
                // <div class="daisy-text">{thinkMessages()}.</div> :
                <div class="daisy-text">思考中...</div> :
                <>
                    {answer() &&
                        <div class="chat chat-start">
                            <div class="chat-bubble">
                                <div
                                    class="markdown-body"
                                    innerHTML={md.render(answer())}
                                />
                            </div>
                        </div>
                    }
                </>
            }
            <QuestionBox/>
        </div>
    )
}

export default Chat
