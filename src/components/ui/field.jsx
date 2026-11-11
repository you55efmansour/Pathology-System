import { useTranslation } from 'react-i18next';

export function Field({ id, label, required, error, children }) {
  const { t } = useTranslation();
  return <div className="form-field"><label htmlFor={id}>{label} {required ? <span className="required-mark" aria-hidden="true">*</span> : <span className="optional">({t('optional')})</span>}</label>{children}{error && <span id={`${id}-error`} role="alert" className="field-error">{t(error.message)}</span>}</div>;
}
