import ConfirmationCard from '@/components/common/confirmation-card';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import { useDeleteSubscriptionMutation } from '@/data/subscription';

const ProductSubscriptionDeleteView = () => {
  const { mutate: deletePage, isLoading: loading } =
  useDeleteSubscriptionMutation();

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

export default ProductSubscriptionDeleteView;
