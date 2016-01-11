MATJUICE=../matjuice.sh
BUILD_DIR=build

all:
	mkdir -p $(BUILD_DIR)
	$(MATJUICE) adpt/drv_adpt.m $(BUILD_DIR)/drv_adpt.js "DOUBLE&1*1&REAL" > /dev/null
	$(MATJUICE) arsim/drv_arsim.m $(BUILD_DIR)/drv_arsim.js "DOUBLE&1*1&REAL" > /dev/null
	$(MATJUICE) arsim/drv_arsim.m $(BUILD_DIR)/drv_arsim.js "DOUBLE&1*1&REAL" > /dev/null
	$(MATJUICE) bbai/drv_babai.m $(BUILD_DIR)/drv_babai.js "DOUBLE&1*1&REAL" > /dev/null
	$(MATJUICE) bubble/drv_bubble.m $(BUILD_DIR)/drv_bubble.js "DOUBLE&1*1&REAL" > /dev/null
	$(MATJUICE) capr/drv_capr.m $(BUILD_DIR)/drv_capr.js "DOUBLE&1*1&REAL" > /dev/null
	$(MATJUICE) clos/drv_clos.m $(BUILD_DIR)/drv_clos.js "DOUBLE&1*1&REAL" > /dev/null
	$(MATJUICE) create/drv_createlhs.m $(BUILD_DIR)/drv_createlhs.js "DOUBLE&1*1&REAL" > /dev/null
	$(MATJUICE) crni/drv_crni.m $(BUILD_DIR)/drv_crni.js "DOUBLE&1*1&REAL" > /dev/null
	$(MATJUICE) dich/drv_dich.m $(BUILD_DIR)/drv_dich.js "DOUBLE&1*1&REAL" > /dev/null
	$(MATJUICE) diff/drv_diff.m $(BUILD_DIR)/drv_diff.js "DOUBLE&1*1&REAL" > /dev/null
	$(MATJUICE) edit/drv_edit.m $(BUILD_DIR)/drv_edit.js "DOUBLE&1*1&REAL" > /dev/null
	$(MATJUICE) fdtd/drv_fdtd.m $(BUILD_DIR)/drv_fdtd.js "DOUBLE&1*1&REAL" > /dev/null
	$(MATJUICE) fft/drv_fft.m $(BUILD_DIR)/drv_fft.js "DOUBLE&1*1&REAL" > /dev/null
	$(MATJUICE) fiff/drv_fiff.m $(BUILD_DIR)/drv_fiff.js "DOUBLE&1*1&REAL" > /dev/null
	$(MATJUICE) lgdr/drv_lgdr.m $(BUILD_DIR)/drv_lgdr.js "DOUBLE&1*1&REAL" > /dev/null
	$(MATJUICE) matmul/drv_matmul_p.m $(BUILD_DIR)/drv_matmul_p.js "DOUBLE&1*1&REAL" > /dev/null
	$(MATJUICE) mbrt/drv_mbrt.m $(BUILD_DIR)/drv_mbrt.js "DOUBLE&1*1&REAL" > /dev/null
	$(MATJUICE) mcpi/drv_mcpi_p.m $(BUILD_DIR)/drv_mcpi_p.js "DOUBLE&1*1&REAL" > /dev/null
	$(MATJUICE) nb1d/drv_nb1d.m $(BUILD_DIR)/drv_nb1d.js "DOUBLE&1*1&REAL" > /dev/null
	$(MATJUICE) nb3d/drv_nb3d.m $(BUILD_DIR)/drv_nb3d.js "DOUBLE&1*1&REAL" > /dev/null
	$(MATJUICE) numprime/drv_prime.m $(BUILD_DIR)/drv_prime.js "DOUBLE&1*1&REAL" > /dev/null
	$(MATJUICE) optstop/drv_osp.m $(BUILD_DIR)/drv_osp.js "DOUBLE&1*1&REAL" > /dev/null
#	$(MATJUICE) quadrature/drv_quad.m $(BUILD_DIR)/drv_quad.js "DOUBLE&1*1&REAL" > /dev/null
#	$(MATJUICE) scra/drv_scra.m $(BUILD_DIR)/drv_scra.js "DOUBLE&1*1&REAL" > /dev/null
	$(MATJUICE) spqr/drv_spqr.m $(BUILD_DIR)/drv_spqr.js "DOUBLE&1*1&REAL" > /dev/null

clean:
	rm -rf $(BUILD_DIR)

.PHONY: all clean
