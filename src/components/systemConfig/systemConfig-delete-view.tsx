import ConfirmationCard from '@/components/common/confirmation-card';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import { useDeleteSystemConfigMutation } from '@/data/system-config';


const SystemConfigDeleteView = () => {
  const { mutate: deleteSystemConfig, isLoading: loading } =
  useDeleteSystemConfigMutation();

  const { data } = useModalState();
  const { closeModal } = useModalAction();
  function handleDelete() {
    deleteSystemConfig({
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

export default SystemConfigDeleteView;
