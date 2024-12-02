package com.example.AdministracionEdificiosTpApis.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.AdministracionEdificiosTpApis.data.PersonaRepository;
import com.example.AdministracionEdificiosTpApis.data.RolRepository;
import com.example.AdministracionEdificiosTpApis.data.UsuarioDAO;
import com.example.AdministracionEdificiosTpApis.data.UsuarioRepository;
import com.example.AdministracionEdificiosTpApis.exceptions.UsuarioException;
import com.example.AdministracionEdificiosTpApis.model.Persona;
import com.example.AdministracionEdificiosTpApis.model.Rol;
import com.example.AdministracionEdificiosTpApis.model.Usuario;

import jakarta.transaction.Transactional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioDAO usuarioDAO; // DAO personalizado para operaciones avanzadas

    @Autowired
    private UsuarioRepository usuarioRepository; // Repository estándar

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private PersonaRepository personaRepository;
    
    @Autowired
    private RolRepository rolRepository;
    
    public List<Usuario> obtenerTodosLosUsuarios() {
        return usuarioDAO.getAllUsuarios(); // Método del DAO personalizado
    }

    public Usuario obtenerUsuarioPorId(int id) throws UsuarioException {
        return usuarioDAO.getUsuarioPorId(id) // Método del DAO personalizado
                .orElseThrow(() -> new UsuarioException("Usuario no encontrado."));
    }

    public Usuario obtenerUsuarioPorNombreUsuario(String nombreUsuario) throws UsuarioException {
        return usuarioDAO.getUsuarioPorNombreUsuario(nombreUsuario) // Método del DAO personalizado
                .orElseThrow(() -> new UsuarioException("Usuario no encontrado."));
    }

    public void agregarUsuario(Usuario usuario) {
        // Verificar si la persona asociada existe
        Optional<Persona> personaOptional = personaRepository.findById(usuario.getPersona().getDocumento());
        if (personaOptional.isEmpty()) {
            throw new IllegalArgumentException("La persona con documento " + usuario.getPersona().getDocumento() + " no existe.");
        }

        // Asignar la persona existente
        usuario.setPersona(personaOptional.get());

        // Encriptar la contraseña
        usuario.setContrasena(passwordEncoder.encode(usuario.getContrasena()));

        // Asignar automáticamente el rol con id = 2
        Rol rolPorDefecto = rolRepository.findById(2L)
                .orElseThrow(() -> new IllegalArgumentException("El rol con id 2 no existe en la base de datos."));
        usuario.setRol(rolPorDefecto);

        // Guardar el usuario
        usuarioDAO.agregarUsuario(usuario);
    }
    
    public void agregarAdmin(Usuario usuario) {
        // Verificar si la persona asociada existe
        Optional<Persona> personaOptional = personaRepository.findById(usuario.getPersona().getDocumento());
        if (personaOptional.isEmpty()) {
            throw new IllegalArgumentException("La persona con documento " + usuario.getPersona().getDocumento() + " no existe.");
        }

        // Asignar la persona existente
        usuario.setPersona(personaOptional.get());

        // Encriptar la contraseña
        usuario.setContrasena(passwordEncoder.encode(usuario.getContrasena()));

        // Asignar el rol ADMIN (id = 1, por ejemplo)
        Rol rolAdmin = rolRepository.findById(1L) // Asegúrate de que el rol ADMIN tiene id = 1
                .orElseThrow(() -> new IllegalArgumentException("El rol 'ADMIN' no existe en la base de datos."));
        usuario.setRol(rolAdmin);

        // Guardar el usuario
        usuarioDAO.agregarUsuario(usuario);
    }



    public void actualizarUsuario(String documento, String nombreUsuario, String contrasena) throws UsuarioException {
        Usuario usuario = usuarioRepository.findByPersonaDocumento(documento)
                .orElseThrow(() -> new UsuarioException("Usuario no encontrado con el documento proporcionado."));

        usuario.setNombreUsuario(nombreUsuario);
        usuario.setContrasena(passwordEncoder.encode(contrasena));

        usuarioRepository.save(usuario);
    }



    public void eliminarUsuario(int id) throws UsuarioException {
        // Verificar que el usuario exista
        Usuario usuario = obtenerUsuarioPorId(id);

        // Validar que el usuario tiene una persona asociada
        if (usuario.getPersona() == null) {
            throw new UsuarioException("El usuario no tiene una persona asociada.");
        }

        // Log de depuración para verificar datos
        System.out.println("Eliminando usuario con ID: " + id +
                ", Nombre de usuario: " + usuario.getNombreUsuario() +
                ", Documento asociado: " + usuario.getPersona().getDocumento());

        // Eliminar usuario
        usuarioDAO.eliminarUsuario(id);
        System.out.println("Usuario eliminado con éxito.");
    }



    public void restablecerContrasena(String nombreUsuario, String dni, String nuevaContrasena) throws UsuarioException {
        Usuario usuario = usuarioRepository.findByNombreUsuario(nombreUsuario)
                .orElseThrow(() -> new UsuarioException("Nombre de usuario no encontrado."));

        if (!usuario.getPersona().getDocumento().equals(dni)) {
            throw new UsuarioException("El DNI no coincide con el usuario.");
        }

        String contrasenaEncriptada = passwordEncoder.encode(nuevaContrasena);
        usuario.setContrasena(contrasenaEncriptada);
        usuarioRepository.save(usuario);
        System.out.println("Contraseña restablecida correctamente para el usuario: " + nombreUsuario);
    }


    @Transactional
    public void actualizarNombreUsuario(String nombreUsuarioActual, String nuevoNombreUsuario) throws UsuarioException {
        Usuario usuario = usuarioDAO.getUsuarioPorNombreUsuario(nombreUsuarioActual)
                .orElseThrow(() -> new UsuarioException("Usuario no encontrado."));

        // Verificar que el nuevo nombre de usuario no está ya en uso
        if (usuarioDAO.getUsuarioPorNombreUsuario(nuevoNombreUsuario).isPresent()) {
            throw new UsuarioException("El nuevo nombre de usuario ya está en uso.");
        }

        usuario.setNombreUsuario(nuevoNombreUsuario);
        usuarioDAO.actualizarUsuario(usuario);
    }
    
    
}

