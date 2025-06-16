import { render, screen, fireEvent } from '@testing-library/react';
import { TypeFilter } from 'interfaces/dashboard';
import FilterBar from './filter-bar';

describe('FilterBar', () => {
  const setup = () => {
    const props = {
      searchTerm: '',
      setSearchTerm: jest.fn(),
      typeFilter: 'all' as TypeFilter,
      setTypeFilter: jest.fn(),
      startDate: '',
      setStartDate: jest.fn(),
      endDate: '',
      setEndDate: jest.fn(),
    };

    render(<FilterBar {...props} />);
    return props;
  };

  it('renders all inputs correctly', () => {
    setup();

    expect(screen.getByPlaceholderText('Buscar por texto…')).toBeInTheDocument();
    expect(screen.getByLabelText('Tipo')).toBeInTheDocument();
    expect(screen.getByLabelText('De')).toBeInTheDocument();
    expect(screen.getByLabelText('Até')).toBeInTheDocument();
  });

  it('calls setSearchTerm on search input change', () => {
    const { setSearchTerm } = setup();
    const input = screen.getByPlaceholderText('Buscar por texto…');

    fireEvent.change(input, { target: { value: 'teste' } });
    expect(setSearchTerm).toHaveBeenCalledWith('teste');
  });

  it('calls setTypeFilter on type selection change', () => {
    const { setTypeFilter } = setup();

    const select = screen.getByLabelText('Tipo');
    fireEvent.mouseDown(select); // Abre o menu
    const entradaOption = screen.getByRole('option', { name: 'Entrada' });
    fireEvent.click(entradaOption);

    expect(setTypeFilter).toHaveBeenCalledWith('deposito');
  });

  it('calls setStartDate on date "De" change', () => {
    const { setStartDate } = setup();
    const input = screen.getByLabelText('De');

    fireEvent.change(input, { target: { value: '2024-01-01' } });
    expect(setStartDate).toHaveBeenCalledWith('2024-01-01');
  });

  it('calls setEndDate on date "Até" change', () => {
    const { setEndDate } = setup();
    const input = screen.getByLabelText('Até');

    fireEvent.change(input, { target: { value: '2024-12-31' } });
    expect(setEndDate).toHaveBeenCalledWith('2024-12-31');
  });
});
