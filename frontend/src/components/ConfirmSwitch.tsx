type Props = { onConfirm: () => void; onCancel: () => void; busy?: boolean };

export function ConfirmSwitch({ onConfirm, onCancel, busy = false }: Props) {
  return <section className="card confirm" role="dialog" aria-modal="true" aria-label="Confirmar cambio de pedido"><h3>¿Cambiar pedido activo?</h3><p>El pedido actual volverá al inicio de la cola y se activará el pedido seleccionado.</p><div className="actions"><button disabled={busy} onClick={onConfirm}>{busy ? 'Cambiando...' : 'Confirmar cambio'}</button><button className="secondary" disabled={busy} onClick={onCancel}>Cancelar</button></div></section>;
}
