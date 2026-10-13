import type { Service } from '../types/booking';
import { PRICING_LABELS } from '../data/catalog';

interface ServiceCheckboxProps {
  service: Service;
  checked: boolean;
  onToggle: (serviceId: string) => void;
}

export function ServiceCheckbox({ service, checked, onToggle }: ServiceCheckboxProps) {
  // იღებს შესაბამის ტექსტს ან აბრუნებს თავად pricing-ის მნიშვნელობას
  const pricingLabel = PRICING_LABELS[service.pricing] ?? service.pricing;

  return (
    <label className={`service ${checked ? 'service--on' : ''}`}>
      <input
        type="checkbox"
        className="service__checkbox"
        checked={checked}
        onChange={() => onToggle(service.id)}
      />
      <span className="service__name">{service.name}</span>
      <span className="service__price">
        {service.price} ₾ {pricingLabel && <small>/{pricingLabel}</small>}
      </span>
    </label>
  );
}