import React from "react";

function RecipeCard({ title, image, onClick }) {
  return (
    <div
      className="card shadow-sm border-0"
      style={{
        cursor: "pointer",
        borderRadius: "12px",
        backgroundColor: "#fffdfb", 
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.03)";
        e.currentTarget.style.boxShadow = "0 6px 15px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 3px 8px rgba(0,0,0,0.1)";
      }}
    >
      <img
        src={image}
        className="card-img-top"
        alt={title}
        style={{
          borderRadius: "12px 12px 0 0",
          height: "200px",
          objectFit: "cover",
        }}
      />
      <div
        className="card-body text-center"
        style={{
          backgroundColor: "#fff8f6",
          borderTop: "1px solid #eae0da",
        }}
      >
        <h6
          className="card-title fw-semibold"
          style={{
            color: "#2e2e2e",
            marginBottom: "0",
          }}
        >
          {title}
        </h6>
        <div
          className="mt-2"
          style={{
            height: "3px",
            width: "30px",
            backgroundColor: "#d60909",
            margin: "0 auto",
            borderRadius: "3px",
          }}
        ></div>
      </div>
    </div>
  );
}

export default RecipeCard;
