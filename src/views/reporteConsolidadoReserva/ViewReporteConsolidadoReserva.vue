<template>

	<el-card class="box-card" style="width: 100%; margin-bottom: 1em;">
		<template #header>
			<div class="card-header">
				<h1>Reporte Consolidado de Reservas</h1>
			</div>
		</template>
		<div class="contentfilters">
			<el-row :gutter="20" justify="center">
				<el-col :span="3">
					Fecha Corte *
					<el-select
						v-model="anio.idAnio"
						placeholder="- Año -"
						clearable
					>
						<el-option
						v-for="item in anios"
						:key="item.idAnio"
						:label="item.nombreAnio"
						:value="item.idAnio"
						/>
					</el-select>
					<el-select
						v-model="mesCorte.codigo"
						placeholder="- Mes -"
						clearable
					>
						<el-option
						v-for="item in mesesCorte"
						:key="item.codigo"
						:label="item.nombre"
						:value="item.codigo"
						/>
					</el-select>
				</el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="24">
					<el-button type="primary" @click="currentPage=1;consultar(currentPage)">Consultar</el-button>
					<el-button type="info" @click="exportar()">Exportar a Excel</el-button>
					<el-button type="info" @click="limpiar()">Limpiar</el-button>
				</el-col>
			</el-row>
		</div>
		<div v-if="datos.length > 0" style="overflow: auto;">
			<div style="width: 130%;">
				<el-row class="ep-bg-primary">
					<el-col :span="5" class="ep-br-cell text-header">
						<strong>RAZÓN SOCIAL</strong>
					</el-col>
					<el-col :span="2" class="ep-br-cell text-header">
						<strong>NIT</strong>
					</el-col>
					<el-col :span="1" class="ep-br-cell text-header">
						<strong># AFILIADOS R4</strong>
					</el-col>
					<el-col :span="1" class="ep-br-cell text-header">
						<strong># AFILIADOS R2</strong>
					</el-col>
					<el-col :span="1" class="ep-br-cell text-header">
						<strong># AFILIADOS SALUD</strong>
					</el-col>
					<el-col :span="1" class="ep-br-cell text-header">
						<strong># AFILIADOS PENSIÓN</strong>
					</el-col>
					<el-col :span="1" class="ep-br-cell text-header">
						<strong># AFILIADOS RIESGO</strong>
					</el-col>
					<el-col :span="2" class="ep-br-cell text-header">
						<strong>CERT. REP. LEGAL</strong>
					</el-col>
					<el-col :span="2" class="ep-br-cell text-header">
						<strong>VALOR SUFICIENCIA</strong>
					</el-col>
					<el-col :span="2" class="ep-br-cell text-header">
						<strong>VALOR REFERENCIA</strong>
					</el-col>
					<el-col :span="6" class="ep-br-cell text-header">
						<strong>OBSERVACION VALOR REFERENCIA</strong>
					</el-col>
				</el-row>
				
				
				<el-row v-for="item in datos" :key="item.nitEntidad" class="ep-bg-secondary" style="pa">
					<el-col :span="5" class="ep-br-cell text-subtext2 align-left">
						{{ item.nombreEntidad }}
					</el-col>
					<el-col :span="2" class="ep-br-cell text-subtext2">
						{{ item.nitEntidad }}
					</el-col>
					<el-col :span="1" class="ep-br-cell text-subtext2">
						{{ toFormat(item.nAfiliadosR4) }}
					</el-col>
					<el-col :span="1" class="ep-br-cell text-subtext2">
						{{ toFormat(item.nAfiliadosR2) }}
					</el-col>
					<el-col :span="1" class="ep-br-cell text-subtext2">
						{{ toFormat(item.nAfiliadosSalud) }}
					</el-col>
					<el-col :span="1" class="ep-br-cell text-subtext2">
						{{ toFormat(item.nAfiliadosPension) }}
					</el-col>
					<el-col :span="1" class="ep-br-cell text-subtext2">
						{{ toFormat(item.nAfiliadosRiesgo) }}
					</el-col>
					<el-col :span="2" class="ep-br-cell text-subtext2">
						{{ toCurrency(item.certificadoRLegal) }}
					</el-col>
					<el-col :span="2" class="ep-br-cell text-subtext2">
						{{ toCurrency(item.valorSuficiencia) }}
					</el-col>
					<el-col :span="2" class="ep-br-cell text-subtext2">
						{{ toCurrency(item.valorReferencia) }}
					</el-col>
					<el-col :span="6" class="ep-br-cell text-subtext2 align-left">
						{{ item.observacionVRef }}
					</el-col>
				</el-row>
			</div>
		</div>
		<div v-if="datos.length > 0">
			<el-row :gutter="20" justify="end">
				<el-pagination
					v-model:current-page="currentPage"
					v-model:page-size="pageSize"
					background
					layout="total, sizes, prev, pager, next"
					:page-sizes="[5, 10, 15, 20, 30, 40, 50, 100, 300, 500, 1000, 2000]"
					:total="datos[0]?.totalRegistros"
					class="mt-4"
					@size-change="currentPage=1;consultar(currentPage)"
					@current-change="consultar(currentPage)"
				/>
			</el-row>
		</div>
	</el-card>
</template>

<script lang="ts" src="./ViewReporteConsolidadoReserva.ts">
</script>

<style>
	.fila {
		border-top: 1px solid #aeaeae;
		margin-top: 5px;
		margin-bottom: 5px;
	}

	.card-header {
		flex-wrap: wrap;
	}
    .el-select {
        width: 100%;
    }
	.el-col {
		padding-right: 0 !important;
		padding-left: 0 !important;
	}
    .contentfilters .el-row {
        margin-bottom: 20px;
    }

	.ep-bg-primary {
		background-color: #36c;
		color: #ffffff;
	}

	.ep-br-cell {
		/* border-radius: 2px; */
		border: 1px solid #dcdfe6;
		padding-top: 5px;
		padding-bottom: 5px;
	}
	
	.ep-bg-secondary {
		background-color: #f5f5f5;
	}

	.text-header {
		font-size: 1.1vw;
	}

	.text-subheader {
		font-size: 12px !important;
		line-height: 1;
	}

	.text-subheader * {
		font-size: 12px !important;
		line-height: 1;
	}

	.text-subtext2 {
		font-size: 0.84vw !important;
		line-height: 1;
		padding-left: 5px !important;
		padding-right: 5px !important;
		overflow-wrap: break-word;
	}

	.text-subtext2 * {
		font-size: 0.84vw !important;
		line-height: 1;
	}

	.align-left {
		text-align: left;
	}
</style>