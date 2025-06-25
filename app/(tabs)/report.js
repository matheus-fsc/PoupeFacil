import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { getRecurringExpenses, getTransactions } from '../../src/services/storage';

// legenda grafico de pizza
const ChartLegend = ({ data }) => (
  <View style={styles.legendContainer}>
    {data.map((item) => (
      <View key={item.category} style={styles.legendItem}>
        <View style={[styles.legendColor, { backgroundColor: item.color }]} />
        <Text style={styles.legendText}>{item.category}</Text>
        <Text style={styles.legendValue}>{item.valueFormatted}</Text>
      </View>
    ))}
  </View>
);

export default function ReportsScreen() {
  const [period, setPeriod] = useState('monthly'); 
  const [isLoading, setIsLoading] = useState(true);
  const [reportData, setReportData] = useState(null);

  const screenWidth = Dimensions.get('window').width;
  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.8,
  };

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        setIsLoading(true);

        const manualTransactions = await getTransactions();
        const recurring = await getRecurringExpenses();
        
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(now.getDate() - 90);

        
        const filteredTransactions = manualTransactions.filter(t => {
            const transactionDate = new Date(t.date);
            if (period === 'monthly') {
                return transactionDate >= firstDayOfMonth;
            } else { 
                return transactionDate >= ninetyDaysAgo;
            }
        });

        // --- Processamento dos dados ---
        let income = 0;
        let variableExpenses = 0;
        const expensesByCategory = {};

        filteredTransactions.forEach(t => {
            if (t.type === 'income') {
                income += t.amount;
            } else {
                variableExpenses += t.amount;
                const category = t.category || 'Outros';
                expensesByCategory[category] = (expensesByCategory[category] || 0) + t.amount;
            }
        });

        
        const fixedExpenses = period === 'monthly' 
            ? recurring.reduce((sum, r) => sum + r.totalValue, 0)
            : recurring.reduce((sum, r) => sum + r.totalValue, 0) * 3; 
        
        recurring.forEach(r => {
            const category = r.name;
            const expenseValue = period === 'monthly' ? r.totalValue : r.totalValue * 3;
            expensesByCategory[category] = (expensesByCategory[category] || 0) + expenseValue;
        });

        const totalExpenses = variableExpenses + fixedExpenses;

        
        const pieData = Object.entries(expensesByCategory)
            .map(([category, value], index) => ({
                name: category,
                population: value,
                color: sliceColors[index % sliceColors.length],
            }))
            .sort((a, b) => b.population - a.population);

        setReportData({
            income,
            totalExpenses,
            barChart: {
                labels: ['Ganhos', 'Gastos'],
                datasets: [{ data: [income / 100, totalExpenses / 100] }],
            },
            pieChart: pieData,
        });

        setIsLoading(false);
      };

      loadData();
    }, [period]) 
  );
  
  const sliceColors = ['#10b981', '#ef4444', '#3b82f6', '#f97316', '#8b5cf6', '#eab308'];

  if (isLoading) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#10b981" /></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <>
          <Text style={styles.title}>Relatórios</Text>

          {/* Seletor de Período */}
          <View style={styles.periodSelector}>
            <TouchableOpacity onPress={() => setPeriod('monthly')} style={[styles.periodButton, period === 'monthly' && styles.periodButtonActive]}>
              <Text style={[styles.periodText, period === 'monthly' && styles.periodTextActive]}>Este Mês</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setPeriod('quarterly')} style={[styles.periodButton, period === 'quarterly' && styles.periodButtonActive]}>
              <Text style={[styles.periodText, period === 'quarterly' && styles.periodTextActive]}>Últimos 90 dias</Text>
            </TouchableOpacity>
          </View>

          {/* Gráfico de Barras: Ganhos vs Gastos */}
          <View style={styles.card}>
            <Text style={styles.chartTitle}>Ganhos vs. Gastos</Text>
            <BarChart
              data={reportData.barChart}
              width={screenWidth - 40}
              height={220}
              yAxisLabel="R$"
              chartConfig={chartConfig}
              fromZero
              showValuesOnTopOfBars
              style={styles.chartStyle}
            />
          </View>

          {/* Gráfico de Pizza: Distribuição de Gastos */}
          <View style={styles.card}>
            <Text style={styles.chartTitle}>Distribuição de Gastos</Text>
            {reportData.pieChart.length > 0 ? (
              <>
                <PieChart
                  data={reportData.pieChart}
                  width={screenWidth - 120}
                  height={220}
                  chartConfig={chartConfig}
                  accessor={"population"}
                  backgroundColor={"transparent"}
                  paddingLeft={"16"}
                  hasLegend={true}
                  style={{ alignSelf: 'center' }}
                />
                <ChartLegend data={reportData.pieChart.map(item => ({
                  category: item.name,
                  valueFormatted: (item.population/100).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'}),
                  color: item.color
                }))} />
              </>
            ) : (
              <Text style={styles.emptyText}>Sem dados de gastos neste período.</Text>
            )}
          </View>
        </>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 32, fontWeight: 'bold', color: '#111827', margin: 20 },
    periodSelector: { flexDirection: 'row', justifyContent: 'center', backgroundColor: '#e5e7eb', borderRadius: 12, marginHorizontal: 20, marginBottom: 20, padding: 4 },
    periodButton: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
    periodButtonActive: { backgroundColor: '#fff', elevation: 2, shadowColor: '#000', shadowOpacity: 0.1 },
    periodText: { fontSize: 14, fontWeight: 'bold', color: '#4b5563' },
    periodTextActive: { color: '#10b981' },
    card: { backgroundColor: '#fff', borderRadius: 16, paddingVertical: 20, marginHorizontal: 20, marginBottom: 20, alignItems: 'center' },
    chartTitle: { fontSize: 18, fontWeight: 'bold', color: '#374151', marginBottom: 10 },
    chartStyle: { borderRadius: 16 },
    legendContainer: { width: '100%', marginTop: 20, paddingHorizontal: 20 },
    legendItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
    legendColor: { width: 14, height: 14, borderRadius: 7, marginRight: 10 },
    legendText: { flex: 1, fontSize: 14, color: '#374151' },
    legendValue: { fontSize: 14, fontWeight: 'bold', color: '#6b7280' },
    emptyText: { marginVertical: 40, fontSize: 16, color: '#6b7280' },
});
