import { render, screen } from "@testing-library/react";
import Footer from "./footer";
import * as routeMatcher from "../../utils/route-matcher/route-matcher";
import * as ui from "../../components/ui/index";

// Mock do componente de imagem e hook usePathname usado no projeto
jest.mock("../../components/ui/index", () => {
  const NextImage =
    jest.requireActual<typeof import("next/image")>("next/image").default;

  return {
    __esModule: true,
    Image: NextImage,
    usePathname: jest.fn(),
  };
});

// Mock da função getBgColor
jest.mock("../../utils/route-matcher/route-matcher", () => ({
  getBgColor: jest.fn(),
}));

describe("Footer", () => {
  const mockPathname = "/home";
  const mockBgColor = "#123456";

  beforeEach(() => {
    (ui.usePathname as jest.Mock).mockReturnValue(mockPathname);
    (routeMatcher.getBgColor as jest.Mock).mockReturnValue(mockBgColor);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render all section titles", () => {
    render(<Footer />);

    expect(screen.getByText("Serviços")).toBeInTheDocument();
    expect(screen.getByText("Contato")).toBeInTheDocument();
    expect(screen.getByText("Developed by Front-End")).toBeInTheDocument();
  });

  it("should render all service items", () => {
    render(<Footer />);

    expect(screen.getByText("Conta corrente")).toBeInTheDocument();
    expect(screen.getByText("Conta PJ")).toBeInTheDocument();
    expect(screen.getByText("Cartão de crédito")).toBeInTheDocument();
  });

  it("should render all contact items", () => {
    render(<Footer />);

    expect(screen.getByText("0800 504 3058")).toBeInTheDocument();
    expect(screen.getByText("suporte@bytebank.com")).toBeInTheDocument();
    expect(screen.getByText("contato@bytebank.com")).toBeInTheDocument();
  });

  it("should render all images with correct alt texts", () => {
    render(<Footer />);

    expect(screen.getByAltText("Bytebank Logo")).toBeInTheDocument();
    expect(screen.getByAltText("Instagram")).toBeInTheDocument();
    expect(screen.getByAltText("YouTube")).toBeInTheDocument();
    expect(screen.getByAltText("Whatsapp")).toBeInTheDocument();
  });

  it("should apply the correct background color", () => {
    const { container } = render(<Footer />);

    const footer = container.querySelector("footer");
    expect(footer).toHaveStyle(`background-color: ${mockBgColor}`);
  });

  it("should call usePathname and getBgColor with correct values", () => {
    render(<Footer />);

    expect(ui.usePathname).toHaveBeenCalled();
    expect(routeMatcher.getBgColor).toHaveBeenCalledWith(mockPathname);
  });
});
