<template>

	<el-card class="box-card" style="width: 100%; margin-bottom: 1em;">
		<template #header>
			<div class="card-header">
				<h1>Consulta Unificada del Reporte de Anexos Técnicos ACO</h1>
			</div>
		</template>
		<div class="contentfilters">
			<el-row :gutter="20" justify="center">
				<el-col :span="12">
					
					<el-row :gutter="20" justify="center">
						<el-col :span="8" style="margin-right: 10px;">
							<el-row :gutter="20" justify="center">
								<el-col :span="24">
								Fecha Corte *
								</el-col>							
							</el-row>
							<el-row :gutter="20" justify="center">
								<el-col :span="11" style="margin-right: 5px;">
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
								</el-col>
								<el-col :span="11" style="margin-right: 5px;">
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
						</el-col>
						
						<el-col :span="4">
							<el-row :gutter="20" justify="center">
								<el-col :span="24">
									&nbsp;
								</el-col>							
							</el-row>
							<el-row :gutter="20" justify="center">
								<el-col :span="24">
									<el-checkbox v-model="entidadesActivas" label="Entidades Activas" size="large" checked="true" />
								</el-col>
							</el-row>
						</el-col>
					</el-row>
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
		<div v-if="datos.length > 0" style="overflow: auto;" class="ep-bg-primary">
			<div style="width: 130%;">
				<el-row>
					<!-- <el-col :span="1" class="ep-bg-primary text-header">
						<strong>Tipo ID</strong>
					</el-col> -->
					<el-col :span="2" class="ep-br-cell text-header">
						<strong>NIT</strong>
					</el-col>
					<el-col :span="4" class="ep-br-cell text-header">
						<strong>Nombre Entidad</strong>
					</el-col>
					<el-col :span="1" class="ep-br-cell text-header">
						<strong>Nro RES Habilitación</strong>
					</el-col>
					<el-col :span="1" class="ep-br-cell text-header">
						<strong>Fecha Habilitación</strong>
					</el-col>
					<el-col :span="2" class="ep-br-cell text-header">
						<strong>Anexo 240</strong>
					</el-col>
					<el-col :span="2" class="ep-br-cell text-header">
						<strong># Reg RACO240</strong>
					</el-col>
					<el-col :span="2" class="ep-br-cell text-header">
						<strong># OK RACO240</strong>
					</el-col>
					<el-col :span="2" class="ep-br-cell text-header">
						<strong>IMAG 240</strong>
					</el-col>
					
					<el-col :span="2" class="ep-br-cell text-header">
						<strong>Anexo 245</strong>
					</el-col>
					<el-col :span="2" class="ep-br-cell text-header">
						<strong># Reg RACO245</strong>
					</el-col>
					<el-col :span="2" class="ep-br-cell text-header">
						<strong># OK RACO245</strong>
					</el-col>
					<el-col :span="2" class="ep-br-cell text-header">
						<strong>IMAG 245</strong>
					</el-col>
				</el-row>
				
				
				<el-row v-for="item in datos" :key="item.nroIdEntidad" class="ep-bg-secondary">
					<!-- <el-col :span="1" class="ep-bg-secondary text-subtext2">
						{{ item.tipoIdEntidad }}
					</el-col> -->
					<el-col :span="2" class="ep-br-cell text-subtext2">
						{{ item.nroIdEntidad }}
					</el-col>
					<el-col :span="4" class="ep-br-cell text-subtext2 align-left">
						{{ item.nombreEntidad }}
					</el-col>
					<el-col :span="1" class="ep-br-cell text-subtext2">
						{{ item.resolucionHabilitacion }}
					</el-col>
					<el-col :span="1" class="ep-br-cell text-subtext2">
						{{ item.fechaHabilitacion }}
					</el-col>
					<el-col :span="2" class="ep-br-cell text-subtext2">
						{{ item.anexo240 }}
					</el-col>
					<el-col :span="2" class="ep-br-cell text-subtext2">
						{{ toFormat(item.rACO240Reg) }}
					</el-col>
					<el-col :span="2" class="ep-br-cell text-subtext2">
						{{ toFormat(item.rACO240OK) }}
					</el-col>
					<el-col :span="2" class="ep-br-cell text-subtext2">
						{{ item.iMAG240 }}
					</el-col>
					
					<el-col :span="2" class="ep-br-cell text-subtext2">
						{{ item.anexo245 }}
					</el-col>
					<el-col :span="2" class="ep-br-cell text-subtext2">
						{{ toFormat(item.rACO245Reg) }}
					</el-col>
					<el-col :span="2" class="ep-br-cell text-subtext2">
						{{ toFormat(item.rACO245OK) }}
					</el-col>
					<el-col :span="2" class="ep-br-cell text-subtext2">
						{{ item.iMAG245 }}
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

<script lang="ts" src="./ViewReporteConsultaUnificadaAT.ts">
</script>

<style>
	* {
		font-size: inherit;
	}
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
		color: black;
	}

	.text-header {
		font-size: 0.7vw !important;
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