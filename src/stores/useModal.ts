import {reactive,onUnmounted,toRefs} from "vue";

//一些定义
type ModalOptions = {
  onOpen?: () => void;
  onClose?: () => void;
}

//全局模态状态池,用Record以name来访问
const globalModals = reactive<
  Record<string,{isOpen:boolean}>
>({})

export default function useModal(name:string) {
  //初始化
  if (!globalModals[name]) {
    globalModals[name] = reactive({
      isOpen: false,
    });
  }

  //该模态的状态
  const state = globalModals[name]

  const open = ()=>{
    state.isOpen = true;
  }

  const close = ()=>{
    state.isOpen = false;
  }

  const toggle = ()=>{
    state.isOpen = !state.isOpen;
  }

  //卸载时关闭
  onUnmounted(() => {
    if (state.isOpen) close();
  });

  return {
    ...toRefs(state),
    open,
    close,
    toggle,
  };
}

