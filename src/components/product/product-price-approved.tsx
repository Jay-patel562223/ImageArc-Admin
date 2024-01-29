import ConfirmationCard from '@/components/common/confirmation-card';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import { useApprovedPriceMutation } from '@/data/product';

const ProductPriceApproved = () => {
  const { mutate: ApprovedPrice, isLoading: loading } =
  useApprovedPriceMutation();

  const { data } = useModalState();
  const { closeModal } = useModalAction();
  function handleDelete() {
    ApprovedPrice({
      id: data?.id,
    });
    closeModal();
  }

  return (
    <ConfirmationCard
    onCancel={closeModal}
    onDelete={handleDelete}
    deleteBtnText={data?.type !== 'approved' ? 'Approve' : 'Pending'}
    title={data?.type !== 'approved' ? 'Approve' : 'Pending'}
    description="Are you sure you want to change status?"
    deleteBtnLoading={loading}
  />

    // <ConfirmationCard
    //   onCancel={closeModal}
    //   onDelete={handleDelete}
    //   deleteBtnLoading={loading}
    // />
  );
};

export default ProductPriceApproved;
