import { render, screen } from "@testing-library/react";
import App from "@src/pages/content/components/ChaosShopper/app";

describe("appTest", () => {
  test("render text", () => {
    // given
    const text = "content view";

    // when
    render(<App domain={'amazon'} />);

    // then
    screen.getByText(text);
  });
});
