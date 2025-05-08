"use client";

import React from "react";
import { Box } from "../../../components/ui";
import { CardMyAccount } from "components/card-my-account/card-my-account";

export default function MyAccountPage() {
  return (
    <Box className="w-full min-h-screen px-4 py-6 lg:px-12 bg-[var(--byte-bg-dashboard)]">
      <Box className="font-sans max-w-screen-xl mx-auto">
        <Box className="flex flex-col lg:flex-row gap-y-6 lg:gap-x-6 lg:ml-8">
          <CardMyAccount />
        </Box>
      </Box>
    </Box>
  );
}
