<template>

	<el-card class="box-card" style="width: 100%; margin-bottom: 1em;">
		<template #header>
			<div class="card-header">
				<h1>Reporte Unificado IBC para Reservas</h1>
			</div>
		</template>
		<div class="contentfilters">
			<el-row :gutter="20">
				<el-col :span="9" style="text-align: left;">
					<span class="demonstration">NIT o Razon Social de la Entidad ACO *</span>
					<el-select
						v-model="entidad.idEmpresa"
						filterable
						remote
						placeholder="Introducir NIT o Razon Social de la Entidad ACO"
						:remote-method="remoteMethod"
						clearable
					>
						<el-option
						v-for="item in entidades"
						:key="item.idEmpresa"
						:label="item.nombreEmpresa"
						:value="item.idEmpresa"
						/>
					</el-select>
				</el-col>
				<el-col :span="3" style="text-align: left;">
					<span class="demonstration">Fecha Corte *</span>
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
				<el-col :span="4">
					<el-checkbox v-model="cruce" label="Planillas que cruzan con PILA" size="large" />
				</el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col :span="24">
					<el-button type="primary" @click="consultar()">Consultar</el-button>
					<el-button type="info" @click="exportar()">Exportar a Excel</el-button>
					<el-button type="info" @click="limpiar()">Limpiar</el-button>
				</el-col>
			</el-row>
		</div>
		<div v-if="datos.length > 0">
			<el-row :gutter="20">
				<el-col :span="2" :xs="24" :sm="5" :md="5" :lg="2" :xl="2">
					<el-row>
						<el-col :span="24" class="ep-bg-primary">
							<strong>AFILIADOS</strong>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12" class="ep-bg-primary text-subheader">
							<strong>No.</strong>
						</el-col>
						<el-col :span="12" class="ep-bg-primary text-subheader">
							<strong>IBC</strong>
						</el-col>
					</el-row>
					<el-row v-for="item in datos" :key="item.cantidad">
						<el-col :span="12" class="ep-bg-secondary text-subtext" v-bind:title="toFormat(item.cantidad)">
							{{ toFormat(item.cantidad) }}
						</el-col>
						<el-col :span="12" class="ep-bg-secondary text-subtext" v-bind:title="toCurrency(item.ibcAco)">
							{{ toCurrency(item.ibcAco) }}
						</el-col>
					</el-row>
				</el-col>
				<el-col :span="6" :xs="24" :sm="19" :md="19" :lg="6" :xl="2">
					<el-row>
						<el-col :span="24" class="ep-bg-primary">
							<strong>SALUD</strong>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="4" class="ep-bg-primary text-subheader">
							<strong>No.</strong>
						</el-col>
						<el-col :span="4" class="ep-bg-primary text-subheader">
							<strong>Aporte</strong>
						</el-col>
						<el-col :span="8" class="ep-bg-primary text-subheader">
							<strong>Aporte + Reserva</strong>
						</el-col>
						<el-col :span="8" class="ep-bg-primary text-subheader">
							<strong>Total Reservas</strong>
						</el-col>
					</el-row>
					<el-row v-for="item in datos" :key="item.cantidad">
						<el-col :span="4" class="ep-bg-secondary text-subtext" v-bind:title="toFormat(item.cantidad)">
							{{ toFormat(item.cantidad) }}
						</el-col>
						<el-col :span="4" class="ep-bg-secondary text-subtext" v-bind:title="toCurrency(item.aporteSalud)">
							{{ toCurrency(item.aporteSalud) }}
						</el-col>
						<el-col :span="8" class="ep-bg-secondary text-subtext" v-bind:title="toCurrency(item.reservaSalud)">
							{{ toCurrency(item.reservaSalud) }}
						</el-col>
						<el-col :span="8" class="ep-bg-secondary text-subtext" v-bind:title="toCurrency(item.totalReservaSalud)">
							{{ toCurrency(item.totalReservaSalud) }}
						</el-col>
					</el-row>
				</el-col>
				<el-col :span="6" :xs="24" :sm="24" :md="12" :lg="6" :xl="2">
					<el-row>
						<el-col :span="24" class="ep-bg-primary">
							<strong>PENSIONES</strong>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="4" class="ep-bg-primary text-subheader">
							<strong>No.</strong>
						</el-col>
						<el-col :span="4" class="ep-bg-primary text-subheader">
							<strong>Aporte</strong>
						</el-col>
						<el-col :span="8" class="ep-bg-primary text-subheader">
							<strong>Aporte + Reserva</strong>
						</el-col>
						<el-col :span="8" class="ep-bg-primary text-subheader">
							<strong>Total Reservas</strong>
						</el-col>
					</el-row>
					<el-row v-for="item in datos" :key="item.cantidad">
						<el-col :span="4" class="ep-bg-secondary text-subtext" v-bind:title="toFormat(item.cantidad)">
							{{ toFormat(item.cantidad) }}
						</el-col>
						<el-col :span="4" class="ep-bg-secondary text-subtext" v-bind:title="toCurrency(item.aportePension)">
							{{ toCurrency(item.aportePension) }}
						</el-col>
						<el-col :span="8" class="ep-bg-secondary text-subtext" v-bind:title="toCurrency(item.reservaPension)">
							{{ toCurrency(item.reservaPension) }}
						</el-col>
						<el-col :span="8" class="ep-bg-secondary text-subtext" v-bind:title="toCurrency(item.totalReservaPension)">
							{{ toCurrency(item.totalReservaPension) }}
						</el-col>
					</el-row>
				</el-col>
				<el-col :span="6" :xs="24" :sm="24" :md="12" :lg="6" :xl="2">
					<el-row>
						<el-col :span="24" class="ep-bg-primary">
							<strong>RIESGOS PROFESIONALES</strong>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="4" class="ep-bg-primary text-subheader">
							<strong>No.</strong>
						</el-col>
						<el-col :span="4" class="ep-bg-primary text-subheader">
							<strong>Aporte</strong>
						</el-col>
						<el-col :span="8" class="ep-bg-primary text-subheader">
							<strong>Aporte + Reserva</strong>
						</el-col>
						<el-col :span="8" class="ep-bg-primary text-subheader">
							<strong>Total Reservas</strong>
						</el-col>
					</el-row>
					<el-row v-for="item in datos" :key="item.cantidad">
						<el-col :span="4" class="ep-bg-secondary text-subtext" v-bind:title="toFormat(item.cantidad)">
							{{ toFormat(item.cantidad) }}
						</el-col>
						<el-col :span="4" class="ep-bg-secondary text-subtext" v-bind:title="toCurrency(item.aporteRiesgo)">
							{{ toCurrency(item.aporteRiesgo) }}
						</el-col>
						<el-col :span="8" class="ep-bg-secondary text-subtext" v-bind:title="toCurrency(item.reservaRiesgo)">
							{{ toCurrency(item.reservaRiesgo) }}
						</el-col>
						<el-col :span="8" class="ep-bg-secondary text-subtext" v-bind:title="toCurrency(item.totalReservaRiesgo)">
							{{ toCurrency(item.totalReservaRiesgo) }}
						</el-col>
					</el-row>
				</el-col>
				<el-col :span="4" :xs="24" :sm="24" :md="24" :lg="4" :xl="2">
					<el-row>
						<el-col :span="24" class="ep-bg-primary">
							<strong>RESERVA TOTAL</strong>
						</el-col>
					</el-row>
					<el-row><el-col :span="24" class="ep-bg-primary text-subheader">.</el-col></el-row>
					<el-row v-for="item in datos" :key="item.cantidad">
						<el-col :span="24" class="ep-bg-secondary text-subtext">
							{{ toCurrency(item.totalReservaSalud+item.totalReservaPension+item.totalReservaRiesgo) }}
						</el-col>
					</el-row>
				</el-col>
			</el-row>
		</div>
		<br>
		<div v-if="datos.length == 2">
			<el-row :gutter="20" justify="center">
				<el-col :xs="24" :sm="20" :md="14" :lg="12" :xl="2">
					<el-row justify="center">
						<el-col :span="10" class="ep-bg-primary">
							<strong>Reserva Especial de Garantía Mínima</strong>
						</el-col>
					</el-row>
					<el-row justify="center">
						<el-col :span="4" class="ep-bg-primary">
							<strong>Para los primeros 500 afiliados:</strong>
						</el-col>
						<el-col :span="6" class="ep-bg-secondary">
							<strong>{{ toCurrency(datos[0].totalReservaEspecial) }}</strong>
						</el-col>
					</el-row>
					<el-row justify="center">
						<el-col :span="4" class="ep-bg-primary">
							<strong>Despues de los primeros 500 afiliados:</strong>
						</el-col>
						<el-col :span="6" class="ep-bg-secondary">
							<strong>{{ toCurrency(datos[1].totalReservaEspecial) }}</strong>
						</el-col>
					</el-row>
					<el-row justify="center">
						<el-col :span="4" class="ep-bg-primary">
							<strong>Total Reserva Exigida:</strong>
						</el-col>
						<el-col :span="6" class="ep-bg-secondary">
							<strong>{{ toCurrency((datos[0].totalReservaEspecial + datos[1].totalReservaEspecial)) }}</strong>
						</el-col>
					</el-row>
				</el-col>
			</el-row>
		</div>
	</el-card>
</template>

<script lang="ts" src="./ViewReporteUnificadoIBCReserva.ts">
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
		border-radius: 2px;
		border: 1px solid #dcdfe6;
	}
	
	.ep-bg-secondary {
		background-color: #f5f5f5;
		border: 1px solid #dcdfe6;
	}

	.text-header {
		font-size: 14px;
	}

	.text-subheader {
		font-size: 12px !important;
		line-height: 1;
	}

	.text-subheader * {
		font-size: 12px !important;
		line-height: 1;
	}

	.text-subtext {
		font-size: 12px !important;
		line-height: 1;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.text-subtext * {
		font-size: 12px !important;
		line-height: 1;
	}
</style>