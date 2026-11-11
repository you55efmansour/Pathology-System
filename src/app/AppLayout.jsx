import { useEffect, useState } from 'react';
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { PanelLeft, ListFilter, ClipboardCheck, Files, LayoutTemplate, CircleHelp, FlaskConical, HardDrive, Languages, ChevronRight } from 'lucide-react';
import { BrandMark } from '@/components/ui/brand';
import { Dialog } from '@/components/ui/dialog';
import { formatDate, formatNumber } from '@/lib/format';
import caseStore from '@/stores/CaseStore';

const links = [{ path: '/cases', icon: ListFilter, key: 'worklist' }, { path: '/review', icon: ClipboardCheck, key: 'reviewQueue' }, { path: '/reports', icon: Files, key: 'finalizedReports' }, { path: '/templates', icon: LayoutTemplate, key: 'templates' }];

function Navigation({ onNavigate }) {
  const { t, i18n } = useTranslation();
  return <>
    <Link className="brand" to="/cases" onClick={onNavigate}><BrandMark /><span className="brand-name">{t('appName')}<span>{t('appTagline')}</span></span></Link>
    <div className="lab-selector"><span className="lab-icon"><FlaskConical size={19} /></span><span className="nav-label">{t('demo')}<small>{t('demoNote')}</small></span></div>
    <nav className="navigation" aria-label={t('menu')}>{links.map(({ path, icon: Icon, key }) => <NavLink key={path} to={path} title={t(key)} onClick={onNavigate} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}><Icon size={19} /><span className="nav-label">{t(key)}</span>{key === 'reviewQueue' && caseStore.cases.some((item) => item.status === 'in_review') && <span className="nav-count">{formatNumber(caseStore.cases.filter((item) => item.status === 'in_review').length, i18n.language)}</span>}</NavLink>)}</nav>
    <div className="nav-bottom"><NavLink to="/workspace" onClick={onNavigate} className="nav-link" title={t('workspace')}><CircleHelp size={19} /><span className="nav-label">{t('workspace')}</span></NavLink><div className="local-storage-note"><HardDrive size={15} /><span className="nav-label">{t('localOnly')}</span><span className="local-dot" /></div></div>
  </>;
}
const NavigationObserver = observer(Navigation);

function AppLayout() {
  const { t, i18n } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const location = useLocation();
  useEffect(() => { caseStore.load(); }, []);
  const current = links.find((link) => location.pathname.startsWith(link.path));
  return <div className={`app-shell${collapsed ? ' sidebar-collapsed' : ''}`}>
    <a href="#main-content" className="skip-link">{t('skip')}</a>
    <aside className="sidebar"><NavigationObserver /></aside>
    <Dialog open={drawer} onOpenChange={setDrawer} title={t('appTagline')} className="navigation-drawer"><NavigationObserver onNavigate={() => setDrawer(false)} /></Dialog>
    <div className="app-body">
      <header className="app-header"><button className="icon-button desktop-toggle" onClick={() => setCollapsed(!collapsed)} aria-label={t('collapse')}><PanelLeft size={19} /></button><button className="icon-button mobile-toggle" onClick={() => setDrawer(true)} aria-label={t('menu')}><PanelLeft size={20} /></button><span className="header-demo"><FlaskConical size={13} />{t('demoShort')}</span><div className="header-location"><span className="header-workspace">{t('appTagline')}</span><ChevronRight size={14} /><span>{t(current?.key || 'workspace')}</span></div><div className="header-tools"><time className="header-date">{formatDate(new Date(), i18n.language)}</time><button className="language-button" onClick={() => i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar')} aria-label={t('language')}><Languages size={17} /><span lang={i18n.language === 'ar' ? 'en' : 'ar'} dir={i18n.language === 'ar' ? 'ltr' : 'rtl'}>{i18n.language === 'ar' ? 'EN' : 'العربية'}</span></button><span className="user-avatar" title={t('demoUser')} aria-label={t('demoUser')}>{t('demoUserInitial')}</span></div></header>
      <main id="main-content" className="main-content" tabIndex={-1}><Outlet /></main>
      <footer className="app-footer"><span><FlaskConical size={13} />{t('demo')}<span className="footer-separator">/</span>{t('demoNote')}</span><span>{t('appName')} <bdi className="footer-version">v0.1</bdi></span></footer>
    </div>
  </div>;
}
export default observer(AppLayout);
