import {useChatQuestionStore} from "../../stores/chat-question-store.js";
import {type Component, createSignal} from "solid-js";

const chatQuestionStore = useChatQuestionStore();

const QuestionBox: Component = () => {
    let textareaRef: HTMLTextAreaElement | undefined;

    const [rows, setRows] = createSignal(1);

    const handleInput = (e: Event) => {
        const target = e.target as HTMLTextAreaElement;
        chatQuestionStore.addQuestion(target.value)
        let cols = Math.floor((textareaRef!.clientWidth) / parseFloat(getComputedStyle(textareaRef!).fontSize));
        // 计算行数（按换行符 +1）
        let lines = target.value.split("\n").length;
        target.value.split('\n').forEach((value) => {
            if (value.length > cols) {
                lines += Math.ceil(value.length / cols)
            }
        })
        setRows(Math.min(4, Math.max(1, lines)));
    };

    function handleAskQuestion() {
        if (!chatQuestionStore.inside() && chatQuestionStore.question()) {
            chatQuestionStore.askQuestion();
        }
    }


    return (
        <div class='w-2xl flexitems-center flex flex-col shadow-lg p-2 rounded-md m-4 bg-base-200 border-solid bg-white'>
            <textarea
                ref={el => textareaRef = el}
                class="text-lg textarea textarea-ghost w-full min-h-min resize-none focus:outline-hidden p-1 focus:bg-base-200"
                rows={rows()}
                placeholder="询问任何问题"
                value={chatQuestionStore.question()}
                onInput={e => handleInput(e)}/>
            <div
                class={`w-full flex items-center justify-between`}
                // class={`transition-transform duration-300 w-min ${chatQuestionStore.inside() || chatQuestionStore.question() ? "translate-x-[650px]" : "translate-x-0]"}`}
            >
                <button class={`p-1 badge badge-soft ${!chatQuestionStore.isOnline() ? "" : "badge-outline badge-primary "} badge-lg rounded-lg m-1 border-[#bdbdbd] cursor-pointer hover:border-dashed `}
                    onClick={() => chatQuestionStore.setOnline(!chatQuestionStore.isOnline())}
                >
                    <IconLineMdLaptopTwotone class='w-5 h-5 p-0'/>
                    联网查询
                </button>

                <span
                    class="shadow-md p-1 badge badge-soft badge-lg rounded-lg m-1 border-[#bdbdbd] hover:border-dashed">
                  {
                      chatQuestionStore.inside() ?
                          <span class="loading loading-infinity loading-sm"></span> :
                          !chatQuestionStore.question() ?
                              <IconLineMdHeartHalfFilled/> :
                              <IconLineMdHeartFilled onClick={handleAskQuestion}/>
                  }
                </span>
            </div>
        </div>
    )
}

export default QuestionBox
