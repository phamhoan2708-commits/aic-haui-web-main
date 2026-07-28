import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MapFrame } from "./MapFrame";

describe("MapFrame", () => {
  it("does not render a frame when no semantic reference or legacy URL is supplied", () => {
    const { container } = render(<MapFrame />);

    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByTitle("Bản đồ")).not.toBeInTheDocument();
  });

  it("renders a stable neutral slot when a semantic map has no approved source", () => {
    render(
      <MapFrame
        mediaRef="contact.map"
        manifest={{
          "contact.map": {
            id: "contact.map",
            kind: "map",
            aspectRatio: "aspect-video",
            alt: "",
          },
        }}
      />,
    );

    expect(screen.getByTestId("media-slot-contact.map")).toHaveClass(
      "prototype-media-slot",
      "aspect-video",
      "rounded-video",
    );
    expect(screen.queryByTitle("Bản đồ")).not.toBeInTheDocument();
  });

  it("preserves the legacy verified URL behavior during page migration", () => {
    render(<MapFrame url="https://maps.example.test/embed" title="AIC map" />);

    expect(screen.getByTitle("AIC map")).toHaveAttribute("src", "https://maps.example.test/embed");
  });

  it("renders a configured semantic map embed with its manifest title", () => {
    render(
      <MapFrame
        mediaRef="contact.map"
        manifest={{
          "contact.map": {
            id: "contact.map",
            kind: "map",
            aspectRatio: "aspect-video",
            embedUrl: "/media/official/map-embed",
            alt: "Bản đồ cơ sở AIC",
          },
        }}
      />,
    );

    expect(screen.getByTitle("Bản đồ cơ sở AIC")).toHaveAttribute(
      "src",
      "/media/official/map-embed",
    );
  });

  it("lets an active-language title override the manifest fallback", () => {
    render(
      <MapFrame
        mediaRef="contact.map"
        title="Map of the AIC location"
        manifest={{
          "contact.map": {
            id: "contact.map",
            kind: "map",
            aspectRatio: "aspect-video",
            embedUrl: "/media/official/map-embed",
            alt: "Bản đồ vị trí AIC",
          },
        }}
      />,
    );

    expect(screen.getByTitle("Map of the AIC location")).toHaveAttribute(
      "src",
      "/media/official/map-embed",
    );
    expect(screen.queryByTitle("Bản đồ vị trí AIC")).not.toBeInTheDocument();
  });

  it("renders a configured approved map image lazily with manifest alt text", () => {
    render(
      <MapFrame
        mediaRef="contact.map"
        manifest={{
          "contact.map": {
            id: "contact.map",
            kind: "map",
            aspectRatio: "aspect-video",
            src: "/media/official/map.webp",
            alt: "Bản đồ cơ sở AIC",
          },
        }}
      />,
    );

    expect(screen.getByRole("img", { name: "Bản đồ cơ sở AIC" })).toHaveAttribute(
      "src",
      "/media/official/map.webp",
    );
    expect(screen.getByRole("img", { name: "Bản đồ cơ sở AIC" })).toHaveAttribute(
      "loading",
      "lazy",
    );
  });

  it("replaces a failed map image with a stable slot and recovers for a new source", () => {
    const firstManifest = {
      "contact.map": {
        id: "contact.map",
        kind: "map" as const,
        aspectRatio: "aspect-video",
        src: "/media/first-map.webp",
        alt: "AIC map",
      },
    };
    const { rerender } = render(
      <MapFrame mediaRef="contact.map" manifest={firstManifest} title="Localized AIC map" />,
    );

    fireEvent.error(screen.getByRole("img", { name: "Localized AIC map" }));

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByTestId("media-slot-contact.map")).toHaveClass(
      "prototype-media-slot",
      "aspect-video",
      "min-h-72",
    );

    rerender(
      <MapFrame
        mediaRef="contact.map"
        title="Localized AIC map"
        manifest={{
          "contact.map": {
            ...firstManifest["contact.map"],
            src: "/media/second-map.webp",
          },
        }}
      />,
    );

    expect(screen.getByRole("img", { name: "Localized AIC map" })).toHaveAttribute(
      "src",
      "/media/second-map.webp",
    );
  });

  it("does not borrow a legacy URL when a semantic map record exists without a source", () => {
    render(
      <MapFrame
        mediaRef="contact.map"
        url="https://maps.example.test/legacy"
        manifest={{
          "contact.map": {
            id: "contact.map",
            kind: "map",
            aspectRatio: "aspect-video",
            alt: "",
          },
        }}
      />,
    );

    expect(screen.getByTestId("media-slot-contact.map")).toHaveClass("prototype-media-slot");
    expect(screen.queryByTitle("Bản đồ")).not.toBeInTheDocument();
  });
});
