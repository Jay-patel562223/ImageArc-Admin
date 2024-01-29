import ConfirmationCard from '@/components/common/confirmation-card';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import { useBlockUserMutation, useUnblockUserMutation } from '@/data/user';

const CustomerBanView = () => {
  const { mutate: blockUser, isLoading: loading } = useBlockUserMutation();
  const { mutate: unblockUser, isLoading: activeLoading } =
    useUnblockUserMutation();

  const { data } = useModalState();
  const { closeModal } = useModalAction();

  async function handleDelete() {
    if (data?.type === 'ban') {
      blockUser({ id: data?.id });
    } else {
      unblockUser({ id: data?.id });
    }
    closeModal();
  }

  return (
    <ConfirmationCard
      onCancel={closeModal}
      onDelete={handleDelete}
      deleteBtnText={data?.type === 'ban' ? 'Block' : 'Unblock'}
      title={data?.type === 'ban' ? 'Block User' : 'Unblock User'}
      description={data?.type === 'ban' ? "Are you sure you want to block this user?" : "Are you sure you want to unblock this user?"}
      deleteBtnLoading={loading || activeLoading}
    />
  );
};

export default CustomerBanView;
