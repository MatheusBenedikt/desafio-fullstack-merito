import { useState } from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { ResumoCarteira } from '@/components/organisms/ResumoCarteira/ResumoCarteira';
import { TabelaMovimentacoes } from '@/components/organisms/TabelaMovimentacoes/TabelaMovimentacoes';
import { Carteira, Movimentacoes, Fundo, PosicaoFundo } from '@/types/investment';
import { TextoMoeda } from '@/components/atoms/TextoMoeda/TextoMoeda';

interface AbaPainelProps {
  carteira: Carteira;
  movimentacoes: Movimentacoes[];
  fundos: Fundo[];
  posicoes: PosicaoFundo[];
  onDeleteMovement: (id: string) => void;
  loading?: boolean;
}

export function AbaPainel({
  carteira,
  movimentacoes,
  fundos,
  posicoes,
  onDeleteMovement,
  loading
}: AbaPainelProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Resumo da Carteira
        </Typography>
        <ResumoCarteira carteira={carteira} />
      </Box>

      <Box>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Posição por Fundo
        </Typography>
        <Box sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          '& > *': {
            flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)', md: '1 1 calc(33.333% - 11px)', lg: '1 1 calc(25% - 12px)' },
            minWidth: 250,
          }
        }}>
          {posicoes.length === 0 ? (
            <Card sx={{ width: '100%' }}>
              <CardContent>
                <Typography color="text.secondary" textAlign="center">
                  Nenhuma posicao encontrada. Faca seu primeiro aporte!
                </Typography>
              </CardContent>
            </Card>
          ) : (
            posicoes.map((posicao) => (
              <Card key={posicao.fundoId}>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary">
                    {posicao.tipo}
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {posicao.ticker}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {posicao.nome}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Cotas: {posicao.quantidadeCotas.toLocaleString('pt-BR', { maximumFractionDigits: 4 })}
                    </Typography>
                    <TextoMoeda
                      value={posicao.valorTotal}
                      variant="h6"
                      sx={{ color: 'success.main' }}
                    />
                  </Box>
                </CardContent>
              </Card>
            ))
          )}
        </Box>
      </Box>

      <Box>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Histórico de Movimentacoes
        </Typography>
        <TabelaMovimentacoes
          movimentacoes={movimentacoes.slice(0, 5)}
          onDelete={onDeleteMovement}
          loading={loading}
        />
      </Box>
    </Box>
  );
}
