import { render, screen } from "@testing-library/react";
import SkeletonListExtract from "./skeleton-list-extract";

describe("SkeletonListExtract", () => {
  /* ♿ 1. A lista deve indicar que está carregando */
  it("marca a lista como ocupada (aria-busy)", () => {
    render(<SkeletonListExtract />);
    const list = screen.getByRole("list", {
      name: /carregando lista de transações/i,
    });
    expect(list).toHaveAttribute("aria-busy", "true");
  });

  /* ♿ 2. Deve haver um <div role=status> em cada linha */
  it("exibe um contêiner com role=status em cada linha", () => {
    const rows = 5; // valor-padrão
    render(<SkeletonListExtract rows={rows} />);
    const statusElements = screen.getAllByRole("status", {
      name: /carregando/i,
    });
    expect(statusElements).toHaveLength(rows);
  });

  /* 3. Renderiza 5 linhas por padrão */
  it("renders the default number of rows (5)", () => {
    render(<SkeletonListExtract />);
    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(5);
  });

  /* 4. Renderiza o número de linhas especificado */
  it("renders the specified number of rows", () => {
    render(<SkeletonListExtract rows={3} />);
    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(3);
  });

  /* 5. Cada linha contém exatamente três skeletons */
  it("renders skeleton elements within each row", () => {
    render(<SkeletonListExtract rows={1} />);
    const listItem = screen.getByRole("listitem");
    const skeletonElements = listItem.querySelectorAll(
      ".h-4.bg-gray-300.rounded"
    );
    expect(skeletonElements).toHaveLength(3);
  });
});
