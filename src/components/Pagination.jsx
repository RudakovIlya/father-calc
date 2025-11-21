import React from "react";
import Button from "./Button";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) {
    return null;
  }

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
      <Button
        variant="secondary"
        size="sm"
        onClick={handlePrev}
        disabled={currentPage === 1}
      >
        Назад
      </Button>
      <span className="text-xl text-gray-200">
        Страница {currentPage} из {totalPages}
      </span>
      <Button
        variant="secondary"
        size="sm"
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        Вперед
      </Button>
    </div>
  );
};

export default React.memo(Pagination);
