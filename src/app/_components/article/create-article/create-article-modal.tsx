"use client";

import { registerArticles } from "@/actions/supabase/articles";
import { User } from "@clerk/nextjs/dist/types/server";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { ClientModalCloseButton } from "../../common/modal/client-modal-close-button";
import { Modal } from "../../common/modal/modal";
import { ModalInner } from "../../common/modal/modal-inner";
import { PasteButton } from "./buttons/paste-button";
import { RegisterButton } from "./buttons/register-button";
import { ResetButton } from "./buttons/reset-button";

type Props = {
  siteUrl: string;
  user: User | null;
  setSiteUrl: (value: string) => void;
  setError: (value: string | null) => void;
  isDisplay: boolean;
  close: () => void;
};

export function CreateArticleModal({
  siteUrl,
  setSiteUrl,
  user,
  setError,
  isDisplay,
  close,
}: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  if (!isDisplay) return null;

  const handleSubmit = async () => {
    if (!siteUrl || siteUrl === "") {
      close();
      return setError("URLを入力してください");
    }

    // FIXME: URLのバリデーションが未完成
    try {
      await registerArticles(siteUrl, user?.id ?? "");

      router.refresh();
      setError(null);
    } catch (error) {
      setError("エラーが発生しました");
      console.error(error);
    } finally {
      handleOnResetTextarea();
      close();
    }
  };

  const handleOnChangeSiteUrl = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setSiteUrl(event.target.value);
  };

  const handleOnClickToPaste = () => {
    navigator.clipboard
      .readText()
      .then((text) => {
        if (inputRef.current) inputRef.current.value = text;
        setSiteUrl(text);
        console.log("ペーストされたテキスト: ", text);
      })
      .catch((err) => {
        console.error("ユーザが拒否、もしくはなんらかの理由で失敗", err);
      });
  };

  const handleOnResetTextarea = () => {
    setSiteUrl("");
  };

  return (
    <Modal>
      <ModalInner>
        <ClientModalCloseButton close={close}></ClientModalCloseButton>
        <div className="mt-20 flex w-full flex-col gap-20">
          <div className="flex w-full items-center">
            <textarea
              value={siteUrl}
              onChange={handleOnChangeSiteUrl}
              className="
                relative h-50 w-full resize-none
                rounded-md border px-2 py-3
                text-xs sm:text-sm
                "
              ref={inputRef}
            ></textarea>
            <ResetButton
              handleOnClick={handleOnResetTextarea}
              isDisabled={!user}
            ></ResetButton>
          </div>

          <div className="flex w-full items-center justify-center gap-10">
            <RegisterButton
              handleOnClick={handleSubmit}
              isDisabled={!user}
            ></RegisterButton>

            <PasteButton
              handleOnClick={handleOnClickToPaste}
              isDisabled={!user}
            ></PasteButton>
          </div>
        </div>
      </ModalInner>
    </Modal>
  );
}