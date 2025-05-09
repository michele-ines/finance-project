import { render, screen } from "@testing-library/react";
import SkeletonListExtract from "./skeleton-list-extract";

describe("SkeletonListExtract", () => {
    it("renders the default number of rows (5)", () => {
        render(<SkeletonListExtract />);
        const listItems = screen.getAllByRole("listitem");
        expect(listItems).toHaveLength(5);
    });

    it("renders the specified number of rows", () => {
        render(<SkeletonListExtract rows={3} />);
        const listItems = screen.getAllByRole("listitem");
        expect(listItems).toHaveLength(3);
    });

    it("renders skeleton elements within each row", () => {
        render(<SkeletonListExtract rows={1} />);
        const listItem = screen.getByRole("listitem");
        const skeletonElements = listItem.querySelectorAll(".h-4.bg-gray-300.rounded");
        expect(skeletonElements).toHaveLength(3);
    });
});