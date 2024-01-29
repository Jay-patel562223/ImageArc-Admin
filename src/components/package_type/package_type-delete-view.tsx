import ConfirmationCard from '@/components/common/confirmation-card';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import { useDeletePackageTypeMutation } from '@/data/package_type';

const ProductPackageTypeDeleteView = () => {
  const { mutate: deletePage, isLoading: loading } =
  useDeletePackageTypeMutation();

  const { data } = useModalState();
  const { closeModal } = useModalAction();
  function handleDelete() {
    deletePage({
      id: data,
    });
    closeModal();
  }

  return (
    <ConfirmationCard
      onCancel={closeModal}
      onDelete={handleDelete}
      deleteBtnLoading={loading}
    />
  );
};

export default ProductPackageTypeDeleteView;
