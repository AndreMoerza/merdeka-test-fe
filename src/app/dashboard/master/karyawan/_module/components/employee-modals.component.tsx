import { ConfirmationFooter } from "@/components/base/app-modals";
import { modals } from "@/hooks/use-modals";
import EmployeeForm from "./employee-form.component";
import ImportEmployeeModalContent from "./import-modal.component";

export const importEmployeeModal = (onRefresh?: () => void) =>
  modals({
    id: "import-employee",
    title: "Import Data Karyawan",
    description: "Upload file dan tunggu proses selesai.",
    content: ({ close }) => <ImportEmployeeModalContent onRefresh={onRefresh} close={close} />,
  });

export const formEmployeeModal = (item?: Karyawan, onRefresh?: () => void) => {
  return modals({
    id: item?.id ? "edit-employee" : "create-employee",
    title: item?.id ? "Edit Karyawan" : "Tambah Karyawan",
    description: item?.id
      ? "Edit karyawan disini dengan merubah informasi berikut."
      : "Tambahkan karyawan disini dengan mengisi informasi berikut.",
    content: ({ close }) => <EmployeeForm item={item} onRefresh={onRefresh} onClose={close} />,
  });
};

export const confirmDeleteEmployeeModal = ({
  requireType,
  next,
}: {
  requireType: string;
  next: () => PromiseLike<void>;
}) =>
  modals({
    id: "confirm-employee-delete",
    title: "Apakah kamu yakin menghapus ini?",
    description: "Karyawan yang sudah dihapus tidak dapat dikembalikan lagi, apakah kamu yakin?",
    footer({ close }) {
      return (
        <ConfirmationFooter
          close={close}
          requireType={requireType}
          variant="destructive"
          next={async () => {
            await next();
            close();
          }}
          nextText="Hapus Karyawan"
        />
      );
    },
  });
