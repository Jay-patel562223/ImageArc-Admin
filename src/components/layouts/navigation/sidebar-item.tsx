import Link from '@/components/ui/link';
import { getIcon } from '@/utils/get-icon';
import * as sidebarIcons from '@/components/icons/sidebar';
import { useUI } from '@/contexts/ui.context';
import cn from 'classnames';
import { useRouter } from 'next/router';

const SidebarItem = ({ href, icon, label }: any) => {
  const { closeSidebar } = useUI();
  const router = useRouter();
  const active = router.pathname.includes(href) && href != '/' ? 'text-[#2FB6CC]' :  router.pathname == href ? 'text-[#2FB6CC]' :""
  // const active = router.pathname == href || href.includes(router.pathname) ? 'text-[#2FB6CC]' : ''

  return (
    <Link
      href={href}
      
      className={cn("text-start flex w-full items-center text-base text-body-dark text-accent", active)}
      // className="text-start flex w-full items-center text-base text-body-dark focus:text-accent"
    >
      {getIcon({
        iconList: sidebarIcons,
        iconName: icon,
        className: 'w-5 h-5 me-4',
      })}
      <span onClick={() => closeSidebar()}>{label}</span>
    </Link>
  );
};

export default SidebarItem;
