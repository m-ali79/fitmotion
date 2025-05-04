"use client";

import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface FoodLogPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const FoodLogPagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: FoodLogPaginationProps) => {
  const renderPaginationLinks = () => {
    const links = [];

    if (totalPages <= 1) return null;

    // Previous Button
    if (currentPage > 1) {
      links.push(
        <PaginationItem key="prev">
          <PaginationPrevious
            href="#"
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              onPageChange(currentPage - 1);
            }}
          />
        </PaginationItem>
      );
    } else {
      links.push(
        <PaginationItem key="prev-disabled">
          <PaginationPrevious
            href="#"
            onClick={(e: React.MouseEvent) => e.preventDefault()}
            aria-disabled={true}
            className="cursor-not-allowed opacity-50"
          />
        </PaginationItem>
      );
    }

    const MAX_VISIBLE_PAGES = 5;
    let startPage = Math.max(
      1,
      currentPage - Math.floor(MAX_VISIBLE_PAGES / 2)
    );
    const endPage = Math.min(totalPages, startPage + MAX_VISIBLE_PAGES - 1);

    if (endPage - startPage + 1 < MAX_VISIBLE_PAGES) {
      startPage = Math.max(1, endPage - MAX_VISIBLE_PAGES + 1);
    }

    // Ellipsis Start
    if (startPage > 1) {
      links.push(
        <PaginationItem key={1}>
          <PaginationLink
            href="#"
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              onPageChange(1);
            }}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        links.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    // Page Number Links
    for (let page = startPage; page <= endPage; page++) {
      links.push(
        <PaginationItem key={page}>
          <PaginationLink
            href="#"
            isActive={currentPage === page}
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              onPageChange(page);
            }}
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Ellipsis End
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        links.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      links.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href="#"
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              onPageChange(totalPages);
            }}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Next Button
    if (currentPage < totalPages) {
      links.push(
        <PaginationItem key="next">
          <PaginationNext
            href="#"
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              onPageChange(currentPage + 1);
            }}
          />
        </PaginationItem>
      );
    } else {
      links.push(
        <PaginationItem key="next-disabled">
          <PaginationNext
            href="#"
            onClick={(e: React.MouseEvent) => e.preventDefault()}
            aria-disabled={true}
            className="cursor-not-allowed opacity-50"
          />
        </PaginationItem>
      );
    }

    return links;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <Pagination className="mt-6">
      <PaginationContent>{renderPaginationLinks()}</PaginationContent>
    </Pagination>
  );
};
