"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {

  const router = useRouter();

  const [cartCount, setCartCount] =
    useState(0);

  const [promo, setPromo] =
    useState("");

  return (

    <main style={{
      background: "#020617",
      color: "white",
      minHeight: "100vh",
      padding: "40px",
      fontFamily: "sans-serif",
    }}>

      <h1 style={{
        fontSize: "48px",
      }}>
        bobGoblin Store 👹
      </h1>

      <div
        data-testid="product-item"
        style={{
          border: "1px solid white",
          padding: "20px",
          marginTop: "20px",
          width: "300px",
          borderRadius: "16px",
        }}
      >

        <h2>
          Goblin Headphones
        </h2>

        <p>
          Chaos-grade audio.
        </p>

        <button
          data-testid="add-to-cart"
          onClick={() =>
            setCartCount(cartCount + 1)
          }
          style={{
            marginTop: "12px",
            padding: "10px",
            background: "#22c55e",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Add to Cart
        </button>

      </div>

      <div
        data-testid="cart-count"
        style={{
          marginTop: "20px",
          fontSize: "24px",
        }}
      >
        {cartCount}
      </div>

      <div style={{
        marginTop: "30px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        width: "300px",
      }}>

        <input
          data-testid="promo-input"
          value={promo}
          onChange={(e) =>
            setPromo(e.target.value)
          }
          placeholder="Promo Code"
          style={{
            padding: "10px",
            borderRadius: "8px",
          }}
        />

        <button
          data-testid="checkout-button"
          onClick={() =>
            router.push("/checkout")
          }
          style={{
            padding: "12px",
            background: "#ef4444",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            color: "white",
            fontWeight: "bold",
          }}
        >
          Checkout
        </button>

      </div>

    </main>

  );

}