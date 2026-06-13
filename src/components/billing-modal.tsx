"use client";

import { useState } from "react";
import { Icon } from "@/components/ui-icon";

const plans = [
  {
    name: "Start",
    price: "€39",
    points: ["Basic analytics", "Automatic insights", "7-day forecast"],
  },
  {
    name: "Grow",
    price: "€99",
    featured: true,
    points: ["Menu Intelligence", "Pricing Engine", "Review replies"],
  },
  {
    name: "Autopilot",
    price: "€199",
    points: ["Auto pricing", "Auto promotions", "Custom rules"],
  },
];

export function BillingModal() {
  const [open, setOpen] = useState(true);

  if (!open) {
    return null;
  }

  return (
    <div className="billing-overlay" role="presentation">
      <section
        className="billing-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="billing-title"
      >
        <button
          className="modal-close"
          type="button"
          aria-label="Close plan chooser"
          onClick={() => setOpen(false)}
        >
          <Icon name="close" size={18} />
        </button>
        <div className="billing-modal-head">
          <h2 id="billing-title">Choose your plan</h2>
          <p>Start with visibility, then unlock optimization and automation.</p>
        </div>
        <div className="billing-plans">
          {plans.map((plan) => (
            <article
              className={`billing-plan ${plan.featured ? "featured" : ""}`}
              key={plan.name}
            >
              {plan.featured ? <span>Best fit</span> : null}
              <h3>{plan.name}</h3>
              <strong>
                {plan.price}
                <small>/month</small>
              </strong>
              <ul>
                {plan.points.map((point) => (
                  <li key={point}>
                    <Icon name="check" size={14} />
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <a
          className="button primary modal-action"
          href="#signup"
          onClick={() => setOpen(false)}
        >
          Start your free trial
        </a>
      </section>
    </div>
  );
}
