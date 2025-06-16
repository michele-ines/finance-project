"use client";

import {
  Stack,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { FilterBarProps, TypeFilter } from "interfaces/dashboard";

export default function FilterBar({
  searchTerm,
  setSearchTerm,
  typeFilter,
  setTypeFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}: FilterBarProps) {
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={1.5}
      rowGap={2}
      flexWrap="wrap"
      pb={2}
      sx={{ borderBottom: "1px solid var(--byte-color-green-50)" }}
    >
      {/* ------ Campo de busca ------ */}
      <TextField
        variant="outlined"
        placeholder="Buscar por texto…"
        size="small"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ flexGrow: 1, minWidth: { xs: "100%", md: 240 } }}
      />

      {/* ------ Tipo de transação ----- */}
      <FormControl size="small" sx={{ width: { xs: "100%", md: 150 } }}>
        <InputLabel id="type-label">Tipo</InputLabel>
        <Select
          labelId="type-label"
          label="Tipo"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
        >
          <MenuItem value="all">Todos</MenuItem>
          <MenuItem value="deposito">Entrada</MenuItem>
          <MenuItem value="saque">Saída</MenuItem>
        </Select>
      </FormControl>

      {/* ------ Datas ------ */}
      <Stack
        direction="row"
        spacing={1}
        sx={{ width: { xs: "100%", md: "auto" } }}
      >
        <TextField
          type="date"
          label="De"
          size="small"
          slotProps={{
            inputLabel: { shrink: true }, 
          }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          sx={{ flex: 1, minWidth: { xs: "calc(50% - 4px)", md: 120 } }}
        />
        <TextField
          type="date"
          label="Até"
          size="small"
          slotProps={{
            inputLabel: { shrink: true },
          }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          sx={{ flex: 1, minWidth: { xs: "calc(50% - 4px)", md: 120 } }}
        />
      </Stack>
    </Stack>
  );
}
