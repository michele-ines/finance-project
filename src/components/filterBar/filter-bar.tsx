"use client";

import {
  Stack,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
} from "@mui/material";
import { FilterBarProps, TypeFilter } from "interfaces/dashboard";

// Estilo para esconder conteúdo visualmente, mas mantê-lo para leitores de tela
const visuallyHidden = {
  border: 0,
  clip: "rect(0 0 0 0)",
  height: 1,
  margin: -1,
  overflow: "hidden",
  padding: 0,
  position: "absolute",
  width: 1,
};

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
    <Box component="form" role="form" aria-labelledby="filter-bar-title" onSubmit={(e) => e.preventDefault()}>
      <Typography id="filter-bar-title" sx={visuallyHidden}>
        Filtros de transação
      </Typography>

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={1.5}
        rowGap={2}
        flexWrap="wrap"
        pb={2}
        sx={{ borderBottom: "1px solid var(--byte-color-green-50)" }}
      >
        {/* ------ Campo de busca com Label ------ */}
        <TextField
          variant="outlined"
          label="Buscar por texto…" // ✅ Usar Label em vez de placeholder
          id="search-term-input"   // ✅ Adicionar ID para associação explícita
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1, minWidth: { xs: "100%", md: 240 } }}
        />

        {/* ------ Tipo de transação (código já estava bom) ----- */}
        <FormControl size="small" sx={{ width: { xs: "100%", md: 150 } }}>
          <InputLabel id="type-filter-label">Tipo</InputLabel>
          <Select
            labelId="type-filter-label"
            label="Tipo"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
          >
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="deposito">Entrada</MenuItem>
            <MenuItem value="saque">Saída</MenuItem>
          </Select>
        </FormControl>

        {/* ------ Datas (código já estava bom) ------ */}
        <Stack
          direction="row"
          spacing={1}
          sx={{ width: { xs: "100%", md: "auto" } }}
        >
          <TextField
            type="date"
            label="De"
            size="small"
            InputLabelProps={{ shrink: true }} // ✅ Melhor forma de usar o shrink
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            sx={{ flex: 1, minWidth: { xs: "calc(50% - 4px)", md: 120 } }}
          />
          <TextField
            type="date"
            label="Até"
            size="small"
            InputLabelProps={{ shrink: true }} // ✅ Melhor forma de usar o shrink
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            sx={{ flex: 1, minWidth: { xs: "calc(50% - 4px)", md: 120 } }}
          />
        </Stack>
      </Stack>
    </Box>
  );
}