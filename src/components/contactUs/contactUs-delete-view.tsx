import ConfirmationCard from '@/components/common/confirmation-card';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import { useDeleteContactUsMutation } from '@/data/contact-Us';
// import { useDeleteContactUsMutation } from '@/data/category';

const CategoryDeleteView = () => {
  const { mutate: deleteContactUs, isLoading: loading } =
  useDeleteContactUsMutation();

  const { data } = useModalState();
  const { closeModal } = useModalAction();
  function handleDelete() {
    deleteContactUs({
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

export default CategoryDeleteView;
