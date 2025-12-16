import { render, screen, fireEvent } from "@testing-library/react";
import Button from "./Button";

describe("Button Component", () => {
  test("renders button with correct label", () => {
    render(<Button label="Submit" />);
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  test("calls onClick when clicked", () => {
    const onClickMock = vi.fn();
    render(<Button label="Click" onClick={onClickMock} />);
    fireEvent.click(screen.getByText("Click"));
    expect(onClickMock).toHaveBeenCalledOnce();
  });
});
