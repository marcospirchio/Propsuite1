package com.example.AdministracionEdificiosTpApis.views;

public enum Estado {
    nuevo, abierto, enProceso, desestimado, anulado, terminado;

    @Override
    public String toString() {

        String name = name();
        return name.substring(0, 1).toUpperCase() + name.substring(1).toLowerCase();
    }
}
