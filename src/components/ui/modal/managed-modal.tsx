import Modal from '@/components/ui/modal/modal';
import UserDeleteView from '@/components/user/user-delete-view';
import dynamic from 'next/dynamic';
import { MODAL_VIEWS, useModalAction, useModalState } from './modal.context';
const TagDeleteView = dynamic(() => import('@/components/tag/tag-delete-view'));
const TaxDeleteView = dynamic(() => import('@/components/tax/tax-delete-view'));
const BanCustomerView = dynamic(
  () => import('@/components/user/user-ban-view')
);
const UserWalletPointsAddView = dynamic(
  () => import('@/components/user/user-wallet-points-add-view')
);
const MakeAdminView = dynamic(
  () => import('@/components/user/make-admin-view')
);
const ShippingDeleteView = dynamic(
  () => import('@/components/shipping/shipping-delete-view')
);
const CategoryDeleteView = dynamic(
  () => import('@/components/category/category-delete-view')
);
const ContactUsDeleteView = dynamic(
  () => import('@/components/contactUs/contactUs-delete-view')
);

const SystemConfigDeleteView = dynamic(
  () => import('@/components/systemConfig/systemConfig-delete-view')
);


const PageDeleteView = dynamic(
  () => import('@/components/static_pages/page-delete-view')
);

const PriceDeleteView = dynamic(
  () => import('@/components/product_price/product-price-delete-view')
);

const DpiDeleteView = dynamic(
  () => import('@/components/product_dpi/product-dpi-delete-view')
);

const CountryDeleteView = dynamic(
  () => import('@/components/country/country-delete-view')
);

const StateDeleteView = dynamic(
  () => import('@/components/country/state-delete-view')
);

const PacakgeTypeDeleteView = dynamic(
  () => import('@/components/package_type/package_type-delete-view')
);

const SubscriptionDeleteView = dynamic(
  () => import('@/components/subscription/subscription-delete-view')
);

const CouponDeleteView = dynamic(
  () => import('@/components/coupon/coupon-delete-view')
);

const ProductDeleteView = dynamic(
  () => import('@/components/product/product-delete-view')
);
const TypeDeleteView = dynamic(
  () => import('@/components/group/group-delete-view')
);
const AttributeDeleteView = dynamic(
  () => import('@/components/attribute/attribute-delete-view')
);

const ApproveShopView = dynamic(
  () => import('@/components/shop/approve-shop-view')
);
const DisApproveShopView = dynamic(
  () => import('@/components/shop/disapprove-shop-view')
);
const RemoveStaffView = dynamic(
  () => import('@/components/shop/staff-delete-view')
);

const ExportImportView = dynamic(
  () => import('@/components/product/import-export-modal')
);

const AttributeExportImport = dynamic(
  () => import('@/components/attribute/attribute-import-export')
);

const UpdateRefundConfirmationView = dynamic(
  () => import('@/components/refund/refund-confirmation-view')
);
const RefundImageModal = dynamic(
  () => import('@/components/refund/refund-image-modal')
);
const ReviewImageModal = dynamic(
  () => import('@/components/reviews/review-image-modal')
);
const QuestionReplyView = dynamic(
  () => import('@/components/question/question-reply-view')
);
const QuestionDeleteView = dynamic(
  () => import('@/components/question/question-delete-view')
);
const ReviewDeleteView = dynamic(
  () => import('@/components/reviews/review-delete-view')
);

const AcceptAbuseReportView = dynamic(
  () => import('@/components/reviews/acccpt-report-confirmation')
);

const DeclineAbuseReportView = dynamic(
  () => import('@/components/reviews/decline-report-confirmation')
);

const CreateOrUpdateAddressForm = dynamic(
  () => import('@/components/address/create-or-update')
);
const AddOrUpdateCheckoutContact = dynamic(
  () => import('@/components/checkout/contact/add-or-update')
);
const SelectCustomer = dynamic(
  () => import('@/components/checkout/customer/select-customer')
);

const AuthorDeleteView = dynamic(
  () => import('@/components/author/author-delete-view')
);
const ManufacturerDeleteView = dynamic(
  () => import('@/components/manufacturer/manufacturer-delete-view')
);

const ProductVariation = dynamic(
  () => import('@/components/product/variation/variation')
);

const ApprovedProduct = dynamic(
  () => import('@/components/product/product-price-approved')
);

const AbuseReport = dynamic(() => import('@/components/reviews/abuse-report'));

function renderModal(view: MODAL_VIEWS | undefined, data: any) {
  switch (view) {
    case 'DELETE_PRODUCT':
      return <ProductDeleteView />;
    case 'DELETE_TYPE':
      return <TypeDeleteView />;
    case 'DELETE_ATTRIBUTE':
      return <AttributeDeleteView />;
    case 'DELETE_CATEGORY':
      return <CategoryDeleteView />;

    case 'DELETE_CONTACTUS':
      return <ContactUsDeleteView />;

    case 'DELETE_SYSTEM_CONFIG':
      return <SystemConfigDeleteView />;

    case 'DELETE_PAGE':
      return <PageDeleteView />;
    case 'DELETE_USER':
      return <UserDeleteView />;
    case 'DELETE_PRICE':
      return <PriceDeleteView />;
    case 'DELETE_DPI':
      return <DpiDeleteView />;
    case 'DELETE_COUNTRY':
      return <CountryDeleteView />;
    case 'DELETE_STATE':
      return <StateDeleteView />;
    case 'DELETE_PACKAGE_TYPE':
      return <PacakgeTypeDeleteView />;
    case 'DELETE_SUBSCRIPTION':
      return <SubscriptionDeleteView />;

    case 'PRODUCT_STATUS':
      return <ApprovedProduct />;

    // case "DELETE_ORDER":
    //   return <OrderDeleteView />;
    case 'DELETE_COUPON':
      return <CouponDeleteView />;
    case 'DELETE_TAX':
      return <TaxDeleteView />;
    case 'DELETE_SHIPPING':
      return <ShippingDeleteView />;
    // case "DELETE_ORDER_STATUS":
    //   return <OrderStatusDeleteView />;
    case 'DELETE_TAG':
      return <TagDeleteView />;
    case 'DELETE_MANUFACTURER':
      return <ManufacturerDeleteView />;
    case 'DELETE_AUTHOR':
      return <AuthorDeleteView />;
    case 'BAN_CUSTOMER':
      return <BanCustomerView />;
    case 'SHOP_APPROVE_VIEW':
      return <ApproveShopView />;
    case 'SHOP_DISAPPROVE_VIEW':
      return <DisApproveShopView />;
    case 'DELETE_STAFF':
      return <RemoveStaffView />;
    case 'UPDATE_REFUND':
      return <UpdateRefundConfirmationView />;
    case 'ADD_OR_UPDATE_ADDRESS':
      return <CreateOrUpdateAddressForm />;
    case 'ADD_OR_UPDATE_CHECKOUT_CONTACT':
      return <AddOrUpdateCheckoutContact />;
    case 'REFUND_IMAGE_POPOVER':
      return <RefundImageModal />;
    case 'MAKE_ADMIN':
      return <MakeAdminView />;
    case 'EXPORT_IMPORT_PRODUCT':
      return <ExportImportView />;
    case 'EXPORT_IMPORT_ATTRIBUTE':
      return <AttributeExportImport />;
    case 'ADD_WALLET_POINTS':
      return <UserWalletPointsAddView />;
    case 'SELECT_PRODUCT_VARIATION':
      return <ProductVariation productSlug={data} />;
    case 'SELECT_CUSTOMER':
      return <SelectCustomer />;
    case 'REPLY_QUESTION':
      return <QuestionReplyView />;
    case 'DELETE_QUESTION':
      return <QuestionDeleteView />;
    case 'DELETE_REVIEW':
      return <ReviewDeleteView />;
    case 'ACCEPT_ABUSE_REPORT':
      return <AcceptAbuseReportView />;
    case 'DECLINE_ABUSE_REPORT':
      return <DeclineAbuseReportView />;
    case 'REVIEW_IMAGE_POPOVER':
      return <ReviewImageModal />;
    case 'ABUSE_REPORT':
      return <AbuseReport data={data} />;
    default:
      return null;
  }
}

const ManagedModal = () => {
  const { isOpen, view, data } = useModalState();
  const { closeModal } = useModalAction();

  return (
    <Modal open={isOpen} onClose={closeModal}>
      {renderModal(view, data)}
    </Modal>
  );
};

export default ManagedModal;
