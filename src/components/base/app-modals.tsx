"use client";

import {
  Dialog as HeadlessDialog,
  DialogPanel as HeadlessDialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { MouseEvent, ReactNode, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useModals } from "@/hooks/use-modals";
import { cn } from "@/lib/utils";

function Loaders() {
  const [open, setOpen] = useState(false);
  const { requestedLoader, dismiss } = useModals();

  useEffect(() => {
    if (requestedLoader) {
      setOpen(true);
    }
  }, [requestedLoader]);

  useEffect(() => {
    if (requestedLoader?.dismissWhen) {
      dismiss();
      setOpen(false);
    }
  }, [requestedLoader, dismiss]);

  return requestedLoader ? (
    <Transition show={open} as="div" id="dgv-loader">
      <TransitionChild
        enter="duration-300 ease-out"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="duration-300 ease-out"
        leaveFrom="opacity-100"
        leaveTo="opacity-0 ease-out"
      >
        <HeadlessDialog
          open={open}
          onClose={() => {
            if (requestedLoader?.dismissable) {
              dismiss();
              setOpen(false);
            }
          }}
          className="relative z-50"
        >
          <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black/30">
            <HeadlessDialogPanel className="max-w-lg space-y-4 border bg-white p-5 px-8 rounded-xl">
              {requestedLoader.content}
            </HeadlessDialogPanel>
          </div>
        </HeadlessDialog>
      </TransitionChild>
    </Transition>
  ) : null;
}

function Modals() {
  const [open, setOpen] = useState(false);
  const { requestedModal, dismiss } = useModals();

  useEffect(() => {
    if (requestedModal) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [requestedModal]);

  return (
    <Dialog
      open={open}
      modal
      onOpenChange={() => {
        dismiss();
        setOpen(false);
      }}
    >
      <DialogContent>
        {requestedModal?.title && (
          <DialogHeader>
            <DialogTitle className={cn(requestedModal?.centeredTitle && "text-center")}>
              {requestedModal.title}
            </DialogTitle>
            {requestedModal.description && (
              <DialogDescription>{requestedModal.description}</DialogDescription>
            )}
          </DialogHeader>
        )}
        <div className="lg:max-h-[500px] max-h-full overflow-y-auto px-1">
          {requestedModal?.content as ReactNode}
        </div>
        {requestedModal?.footer && (
          <DialogFooter>
            {(requestedModal.footer as ({ close }: { close: () => void }) => React.ReactNode)({
              close: () => {
                dismiss();
                setOpen(false);
              },
            })}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

function ConfirmationFooter({
  close,
  next,
  nextText,
  requireType,
  variant = "default",
}: {
  close: () => void;
  next?: (e: MouseEvent<HTMLButtonElement>) => void;
  nextText?: string;
  requireType?: string;
  variant?: "default" | "destructive";
}) {
  const [type, setType] = useState("");
  const [isLoading, setLoading] = useState(false);

  return requireType ? (
    <div className="flex flex-col space-y-2 items-center w-full justify-center">
      <div className="w-full space-y-2">
        <p className="text-sm">
          Ketik <strong>{requireType}</strong> untuk konfirmasi.
        </p>
        <Input
          onChange={(e) => setType(e.target.value)}
          placeholder="Ketik disini untuk konfirmasi"
          type="text"
          className="w-full"
        />
        <p className="text-xs text-red-700 mt-1">
          Saya paham bahwa tindakan ini tidak bisa dibatalkan, dan saya yakin untuk melanjutkan.
        </p>
      </div>
      <div className="flex flex-row w-full space-x-2 justify-end items-center">
        <Button onClick={close} variant="outline" type="button">
          Batal
        </Button>
        <Button
          onClick={async (e) => {
            setLoading(true);
            await Promise.resolve(next?.(e));
            setLoading(false);
          }}
          variant={variant}
          type="button"
          disabled={type !== requireType}
          isLoading={isLoading}
        >
          {nextText || "Lanjut"}
        </Button>
      </div>
    </div>
  ) : (
    <div className="flex flex-row w-full space-x-2 justify-end items-center">
      <Button onClick={close} variant="outline" type="button">
        Batal
      </Button>
      <Button
        onClick={async (e) => {
          setLoading(true);
          await Promise.resolve(next?.(e));
          setLoading(false);
        }}
        variant={variant}
        type="button"
        isLoading={isLoading}
      >
        {nextText || "Lanjut"}
      </Button>
    </div>
  );
}

export { ConfirmationFooter, Loaders, Modals };
