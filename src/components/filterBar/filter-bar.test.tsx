import { render, screen, fireEvent } from '@testing-library/react';
import { TypeFilter } from 'interfaces/dashboard';
import FilterBar from './filter-bar'; // Ajuste o caminho se necessário

describe('FilterBar', () => {
  const mockProps = {
    searchTerm: '',
    setSearchTerm: jest.fn(),
    typeFilter: 'all' as TypeFilter,
    setTypeFilter: jest.fn(),
    startDate: '',
    setStartDate: jest.fn(),
    endDate: '',
    setEndDate: jest.fn(),
  };

  beforeEach(() => {
    // Limpa mocks antes de cada teste para garantir isolamento
    jest.clearAllMocks();
    render(<FilterBar {...mockProps} />);
  });
  
  it('deve renderizar como um formulário com um nome acessível', () => {
    // ✅ Novo teste para a semântica do formulário
    const form = screen.getByRole('form', { name: /Filtros de transação/i });
    expect(form).toBeInTheDocument();
  });

  it('deve renderizar todos os campos com seus labels corretos', () => {
    // ✅ Atualizado para usar o label do campo de busca
    expect(screen.getByLabelText('Buscar por texto…')).toBeInTheDocument();
    expect(screen.getByLabelText('Tipo')).toBeInTheDocument();
    expect(screen.getByLabelText('De')).toBeInTheDocument();
    expect(screen.getByLabelText('Até')).toBeInTheDocument();
  });

  it('deve chamar setSearchTerm ao alterar o campo de busca', () => {
    const { setSearchTerm } = mockProps;
    // ✅ Atualizado para usar o label do campo de busca
    const input = screen.getByLabelText('Buscar por texto…');

    fireEvent.change(input, { target: { value: 'teste' } });
    expect(setSearchTerm).toHaveBeenCalledWith('teste');
  });

  // Os testes abaixo já estavam ótimos e não precisam de mudança
  it('deve chamar setTypeFilter ao selecionar um tipo', () => {
    const { setTypeFilter } = mockProps;

    const select = screen.getByLabelText('Tipo');
    fireEvent.mouseDown(select);
    const entradaOption = screen.getByRole('option', { name: 'Entrada' });
    fireEvent.click(entradaOption);

    expect(setTypeFilter).toHaveBeenCalledWith('deposito');
  });

  it('deve chamar setStartDate ao alterar a data "De"', () => {
    const { setStartDate } = mockProps;
    const input = screen.getByLabelText('De');

    fireEvent.change(input, { target: { value: '2025-01-01' } });
    expect(setStartDate).toHaveBeenCalledWith('2025-01-01');
  });

  it('deve chamar setEndDate ao alterar a data "Até"', () => {
    const { setEndDate } = mockProps;
    const input = screen.getByLabelText('Até');

    fireEvent.change(input, { target: { value: '2025-12-31' } });
    expect(setEndDate).toHaveBeenCalledWith('2025-12-31');
  });
});