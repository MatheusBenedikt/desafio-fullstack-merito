import { TextField, TextFieldProps, MenuItem } from '@mui/material';

interface Opcao {
  value: string;
  label: string;
}

interface CampoFormularioProps extends Omit<TextFieldProps, 'select'> {
  options?: Opcao[];
}

export function CampoFormulario({ options, ...props }: CampoFormularioProps) {
  if (options) {
    return (
      <TextField
        select
        fullWidth
        {...props}
      >
        {options.map((opcao) => (
          <MenuItem key={opcao.value} value={opcao.value}>
            {opcao.label}
          </MenuItem>
        ))}
      </TextField>
    );
  }

  return <TextField fullWidth {...props} />;
}
