export default function Modal({ title, children, onClose, footer, large }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal ${large ? 'lg' : ''}`} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="btn-ghost" onClick={onClose}><i className="fa-solid fa-xmark"></i></button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
