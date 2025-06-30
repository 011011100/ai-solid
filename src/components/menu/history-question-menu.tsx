import {type Component, createSignal} from "solid-js";
import {onMount, Show} from "solid-js";
import HistoryConversation from "../../type/history-conversation.js";
import {useChatConversationStore} from "../../stores/chat-conversation-store.js";
import {useMessagesStore} from "../../stores/chat-message-store.js";
import {useChatQuestionStore} from "../../stores/chat-question-store.js";
import "./history-question-menu.css"
import DropdownMenu, {type DropdownItem} from "./dropdown-menu.js";

// @ts-ignore
import {autoFocus} from "../../directives/auto-focus.js";
import {useEventSource} from "../../utils/use-event-source.js";
import {changeTitleApi, deleteQuestionApi} from "../../api/default-chat-api.js";

const historyQuestionMenu: Component = () => {

    const conversationStore = useChatConversationStore;
    const {removeAllMessage, getMessage} = useMessagesStore()
    const chatStore = useChatQuestionStore()

    const [canChange, setCanChange] = createSignal<boolean[]>([])

    const [changeTitleValue, setChangeTitleValue] = createSignal<string>("")

    const item: DropdownItem[] = [
        {
            node: <>
                <IconMdiRename class="h-5 w-5 p-0 pr-1"/>
                重命名
            </>,
            action: (i) => updateCanChange(i, true),
        },
        {
            node: <>
                <IconMdiDelete class="h-5 w-5 p-0 pr-1 text-red-400"/>
                删除
            </>,
            action: (i) => handleDelete(i),
        },
    ]

    onMount(() => {
        conversationStore().getAllConversation();
        let can: boolean[] = []
        for (let i = 0; i < conversationStore().historyConversation().length; i++) {
            can.push(...can, false)
        }
        setCanChange(can)
    })

    function updateCanChange (index: number, value: boolean) {
        const updated = [...canChange()];
        updated[index] = value;
        setCanChange(updated);
        setChangeTitleValue(conversationStore().historyConversation()[index].problemSummary)
    }

    function getHistoryMessage(conversationId: string): void {
        removeAllMessage()
        getMessage(conversationId);
        chatStore.setIsNewQuestion(false);
    }

    function handleUpdateTitle(newTitle: string, conversationId: string, index: number) {
        useEventSource(changeTitleApi(newTitle, conversationId), {
            onMessage: () =>{
                conversationStore().updateConversation({conversationId: conversationId,problemSummary: newTitle})
            },
            onError: () => {

            }
        });
        updateCanChange(index, false);
    }

    function handleDelete(index: number) {
        useEventSource(deleteQuestionApi(conversationStore().historyConversation()[index].conversationId),{
            onMessage: ()=>{
                conversationStore().getAllConversation()
            }
        })
    }

    return (
        <ul class="menu bg-base-200 rounded-box w-56 h-220 overflow-y-auto whitespace-nowrap list-none overflow-x-hidden block">
            <li class='menu-title'>聊天</li>
            <Show when={conversationStore().historyConversation().length > 0}
                  fallback={<li class='menu-title'>这里什么都没有哦</li>}>
                {conversationStore().historyConversation().map((data: HistoryConversation, index) => {
                    return <li class='text-base whitespace-nowrap'>
                        <div class='items-center flex flex-row flex-nowrap w-52 hover-container'>
                            <Show when={!canChange()[index]}
                                  fallback={<input use:autoFocus
                                                   class='w-50 inline-block whitespace-nowrap pr-1'
                                                   value={changeTitleValue()}
                                                   onInput={(e) => setChangeTitleValue(e.currentTarget.value)}
                                                   onBlur={() => updateCanChange(index, false)}
                                                   onKeyDown={(e) => {
                                                       if (e.key === "Enter") {
                                                           setChangeTitleValue(e.currentTarget.value)
                                                           handleUpdateTitle(changeTitleValue(), data.conversationId, index)
                                                       }
                                                   }}
                                  />}>
                                <a class='w-50 inline-block text-ellipsis overflow-hidden whitespace-nowrap pr-1'
                                   title={data.problemSummary}
                                   onClick={() => {
                                       getHistoryMessage(data.conversationId)
                                       chatStore.setConversationId(data.conversationId)
                                   }}>
                                    {data.problemSummary}

                                </a>
                                <div class="tooltip">
                                    <DropdownMenu index={index}
                                                  items={item}/>
                                </div>
                            </Show>
                        </div>
                    </li>
                })}
            </Show>
        </ul>
    )
}

export default historyQuestionMenu
